import tensorflow.compat.v1 as tf
from magenta.models.onsets_frames_transcription.configs import CONFIG_MAP
from note_seq.protobuf import music_pb2
from magenta.models.onsets_frames_transcription import infer_util, constants

from audio import Audio
from graph_predict import graph_predict, GraphPredictionRequest
from fn.helpers import log_timer
from fn.onsets_and_frames.helpers import preprocess_audio_for_transcription
from midi import Midi

_hparams = CONFIG_MAP["onsets_frames"].hparams
_hparams.parse("")
_hparams.batch_size = 1
_hparams.truncated_length_secs = 0
_hparams.use_tpu = False


@log_timer
def _preprocess(audio: Audio) -> GraphPredictionRequest:
    return preprocess_audio_for_transcription(audio, "onsets-and-frames-piano-transcriber", _hparams)


@log_timer
def _postprocess(model_result) -> Midi:
    def _predict(frame_probs, onset_probs, frame_predictions, onset_predictions,
                 offset_predictions, velocity_values):
        sequence = infer_util.predict_sequence(
            frame_probs=frame_probs,
            onset_probs=onset_probs,
            frame_predictions=frame_predictions,
            onset_predictions=onset_predictions,
            offset_predictions=offset_predictions,
            velocity_values=velocity_values,
            hparams=_hparams,
            min_pitch=constants.MIN_MIDI_PITCH)
        return sequence.SerializeToString()

    sequence = tf.py_func(
        _predict,
        inp=[
            model_result["frame_probs"][0],
            model_result["onset_probs"][0],
            model_result["frame_predictions"][0],
            model_result["onset_predictions"][0],
            model_result["offset_predictions"][0],
            model_result["velocity_values"][0]
        ],
        Tout=tf.string,
        stateful=False)
    sequence.set_shape([])
    result = tf.expand_dims(sequence, axis=0)
    sequence = result[0].numpy()
    sequence = music_pb2.NoteSequence.FromString(sequence)
    return Midi.from_note_sequence(sequence)


# TODO: simplify this pattern of preprocess, postprocess
def transcribe_piano(audio: Audio) -> Midi:
    return _postprocess(graph_predict(_preprocess(audio)))
