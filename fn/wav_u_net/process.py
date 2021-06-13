from typing import Dict
import numpy as np

from fn.helpers import log_timer
from fn.wav_u_net import helpers
from file.audio import Audio
from graph_predict.tf_grpc_service import TFGraphPredictionRequest, get_tf_grpc_prediction
from fn.wav_u_net.model import UnetAudioSeparator


class _TrackLike(object):
    def __init__(self, audio, rate, shape):
        self.audio = audio
        self.rate = rate
        self.shape = shape


def load_track_like(audio: Audio) -> _TrackLike:
    audio, sr = audio.require_raw()
    return _TrackLike(audio, sr, audio.shape)


def predict_track(mix_audio, mix_sr, sep_input_shape, sep_output_shape, config, tf_serving_model_name):
    assert (len(mix_audio.shape) == 2)
    if config["mono_downmix"]:
        mix_audio = np.mean(mix_audio, axis=1, keepdims=True)
    else:
        if mix_audio.shape[1] == 1:  # Duplicate channels if input is mono but model is stereo
            mix_audio = np.tile(mix_audio, [1, 2])

    mix_audio = helpers.resample(mix_audio, mix_sr, config["expected_sr"])

    # Append zeros to mixture if its shorter than input size of network - this will be cut off at the end again
    if mix_audio.shape[0] < sep_input_shape[1]:
        extra_pad = sep_input_shape[1] - mix_audio.shape[0]
        mix_audio = np.pad(mix_audio, [(0, extra_pad), (0, 0)], mode="constant", constant_values=0.0)
    else:
        extra_pad = 0

    # Preallocate source predictions (same shape as input mixture)
    source_time_frames = mix_audio.shape[0]
    source_preds = {name: np.zeros(mix_audio.shape, np.float32) for name in config["source_names"]}

    input_time_frames = sep_input_shape[1]
    output_time_frames = sep_output_shape[1]

    # Pad mixture across time at beginning and end so that neural network can make prediction at the beginning and end of signal
    pad_time_frames = (input_time_frames - output_time_frames) // 2
    mix_audio_padded = np.pad(mix_audio, [(pad_time_frames, pad_time_frames), (0, 0)], mode="constant",
                              constant_values=0.0)

    # Iterate over mixture magnitudes, fetch network rpediction
    for source_pos in range(0, source_time_frames, output_time_frames):
        # If this output patch would reach over the end of the source spectrogram, set it so we predict the very end of the output, then stop
        if source_pos + output_time_frames > source_time_frames:
            source_pos = source_time_frames - output_time_frames

        # Prepare mixture excerpt by selecting time interval
        mix_part = mix_audio_padded[source_pos:source_pos + input_time_frames, :]
        mix_part = np.expand_dims(mix_part, axis=0)

        source_parts = get_tf_grpc_prediction(TFGraphPredictionRequest(
            model_name=tf_serving_model_name,
            inputs={"mix_context": mix_part},
            output_keys=config["source_names"]
        ))

        for name in config["source_names"]:
            data = np.array([source_parts[name]])
            source_preds[name][source_pos:source_pos + output_time_frames] = data[0, :, :]

    # In case we had to pad the mixture at the end, remove those samples from source prediction now
    if extra_pad > 0:
        source_preds = {name: source_preds[name][:-extra_pad, :] for name in list(source_preds.keys())}

    return source_preds


@log_timer
def process(audio: Audio, config: dict, tf_serving_model_name: str) -> Dict[str, Audio]:
    track = load_track_like(audio)
    mix_audio, orig_sr, mix_channels = track.audio, track.rate, track.audio.shape[1]
    mix_audio = mix_audio.astype('float32')
    disc_input_shape = [config["batch_size"], config["num_frames"], 0]
    separator = UnetAudioSeparator(config)
    sep_input_shape, sep_output_shape = separator.get_padding(np.array(disc_input_shape))
    preds = predict_track(mix_audio, orig_sr, sep_input_shape, sep_output_shape, config, tf_serving_model_name)

    pred_audio = {name: helpers.resample(preds[name], config["expected_sr"], orig_sr)[:mix_audio.shape[0], :] for name
                  in
                  config["source_names"]}

    if config["mono_downmix"] and mix_channels > 1:
        pred_audio = {name: np.tile(pred_audio[name], [1, mix_channels]) for name in list(pred_audio.keys())}

    return {name: Audio.from_raw(source_audio, track.rate) for name, source_audio in list(pred_audio.items())}
