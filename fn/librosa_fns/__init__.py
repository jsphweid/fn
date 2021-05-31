import librosa
import numpy as np

from audio import Audio


def librosa_transpose(audio: Audio, num_steps: float) -> Audio:
    # TODO: make work for ndim audio
    y, sr = audio.require_raw()
    mono_signal = librosa.to_mono(np.transpose(y))
    result = librosa.effects.pitch_shift(mono_signal, sr, num_steps)
    return Audio.from_raw(result, sr)
