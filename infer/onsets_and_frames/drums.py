import functools
import tensorflow.compat.v1 as tf
from magenta.models.onsets_frames_transcription.configs import CONFIG_MAP
from magenta.models.onsets_frames_transcription import infer_util, constants
from note_seq.protobuf import music_pb2

from audio import Audio
from graph_predict import GraphPredictionRequest, graph_predict, ModelResult
from infer.helpers import log_timer
from infer.onsets_and_frames.helpers import preprocess_audio_for_transcription
from midi import Midi

_hparams = CONFIG_MAP["drums"].hparams
_hparams.parse("")
_hparams.batch_size = 1
_hparams.truncated_length_secs = 0
_hparams.use_tpu = False


@log_timer
def _preprocess(audio: Audio) -> GraphPredictionRequest:
    return preprocess_audio_for_transcription(audio, "onsets-and-frames-drum-transcriber", _hparams)


@log_timer
def _postprocess(model_result: ModelResult):
    def predict_sequence(frame_probs, onset_probs, frame_predictions, onset_predictions, offset_predictions,
                         velocity_values, hparams):
        sequence_prediction = infer_util.predict_sequence(
            frame_probs=frame_probs,
            onset_probs=onset_probs,
            frame_predictions=onset_predictions,
            onset_predictions=onset_predictions,
            offset_predictions=onset_predictions,
            velocity_values=velocity_values,
            min_pitch=constants.MIN_MIDI_PITCH,
            hparams=_hparams,
            onsets_only=True)
        for note in sequence_prediction.notes:
            note.is_drum = True
        return sequence_prediction.SerializeToString()

    sequences = []
    for i in range(model_result["frame_predictions"].shape[0]):
        sequence = tf.py_func(
            functools.partial(predict_sequence, hparams=_hparams),
            inp=[
                model_result["frame_probs"][i],
                model_result["onset_probs"][i],
                model_result["frame_predictions"][i],
                model_result["onset_predictions"][i],
                model_result["offset_predictions"][i],
                model_result["velocity_values"][i],
            ],
            Tout=tf.string,
            stateful=False)
        sequence.set_shape([])
        sequences.append(sequence)
    sequence = tf.stack(sequences)[0].numpy()
    sequence = music_pb2.NoteSequence.FromString(sequence)
    return Midi.from_note_sequence(sequence)


# TODO: simplify this pattern of preprocess, postprocess
def transcribe_drums(audio: Audio) -> Midi:
    return _postprocess(graph_predict(_preprocess(audio)))
