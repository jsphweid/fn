import functools
import tensorflow.compat.v1 as tf
from magenta.models.onsets_frames_transcription.data import read_examples, preprocess_example, \
    input_tensors_to_model_input, splice_examples, create_batch

from file.audio import Audio
from graph_predict.tf_grpc_service import TFGraphPredictionRequest


def preprocess_audio_for_transcription(audio: Audio, model_name: str, hparams: dict) -> TFGraphPredictionRequest:
    example = audio.to_example_proto(hparams.sample_rate)
    input_dataset = read_examples([example], False, False, 0, hparams)
    input_map_fn = functools.partial(preprocess_example, hparams=hparams, is_training=False)
    input_tensors = input_dataset.map(input_map_fn)
    model_input = input_tensors.map(
        functools.partial(input_tensors_to_model_input, hparams=hparams, is_training=False))
    model_input = splice_examples(model_input, hparams, False)
    dataset = create_batch(model_input, hparams=hparams, is_training=False)
    t, _ = dataset.prefetch(buffer_size=tf.data.experimental.AUTOTUNE).make_one_shot_iterator().get_next()
    return TFGraphPredictionRequest(
        model_name=model_name,
        inputs={"input": t.spec.numpy()},
        output_keys=["frame_probs", "onset_probs", "frame_predictions", "onset_predictions", "offset_predictions",
                     "velocity_values"]
    )
