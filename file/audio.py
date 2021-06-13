import io
import os
from typing import Optional
import librosa
import numpy as np
import soundfile as sf
import random

from magenta.models.onsets_frames_transcription.onsets_frames_transcription_transcribe import create_example


class Audio:
    """
    TODO: add documentation on how this works
    """
    _maybe_local_file_path: Optional[str]
    _raw_audio: Optional[np.ndarray]
    _sampling_rate: Optional[int]

    def __init__(self, local_file_path=None, raw_audio=None, sampling_rate=None):
        self._maybe_local_file_path = local_file_path
        self._raw_audio = raw_audio
        self._sampling_rate = sampling_rate

    @classmethod
    def from_local_file(cls, path: str, sampling_rate: Optional[int] = None) -> 'Audio':
        return Audio(local_file_path=path, sampling_rate=sampling_rate)

    @classmethod
    def from_raw(cls, raw_audio: np.ndarray, sampling_rate: int) -> 'Audio':
        return Audio(raw_audio=raw_audio, sampling_rate=sampling_rate)

    @classmethod
    def from_bytes(cls, b: bytes) -> 'Audio':
        y, sr = sf.read(io.BytesIO(b))
        return Audio(raw_audio=y, sampling_rate=sr)

    def to_wav_bytes(self):
        y, sr = self.require_raw()
        b = io.BytesIO()
        sf.write(b, y, sr, format='WAV')
        return b.getbuffer().tobytes()

    def save_locally(self, output_path: str):
        y, sr = self.require_raw()
        librosa.output.write_wav(output_path, y, sr)

    def to_example_proto(self, sample_rate=16000):
        if self._maybe_local_file_path:
            return create_example(self._maybe_local_file_path, sample_rate, False)

        # hack because `create_example` can really only take a file path unfortunately...
        temp_file_path = f"/tmp/{random.getrandbits(128)}.wav"
        with open(temp_file_path, "wb") as f:
            f.write(self.to_wav_bytes())
        example = create_example(temp_file_path, sample_rate, False)
        os.remove(temp_file_path)
        return example

    def require_raw(self, sampling_rate=None, mono=False) -> (np.ndarray, int):
        if self._raw_audio is not None and self._sampling_rate is not None:
            # TODO: implement choosing resampling method?
            y = librosa.resample(self._raw_audio, self._sampling_rate, target_sr=sampling_rate) \
                if sampling_rate and sampling_rate != self._sampling_rate else self._raw_audio
            y = librosa.to_mono(np.transpose(y)) if mono else y
            return y, sampling_rate or self._sampling_rate
        elif self._maybe_local_file_path is not None:
            y, sr = librosa.load(self._maybe_local_file_path, sr=sampling_rate or self._sampling_rate, mono=mono)
            # TODO: figure out what this code does and decide if we need it (bad for resnet38, good potentially for wav_u_net
            # Looks like it changes the shape for a mono signal (??)
            # if len(y.shape) == 1:
            #     y = np.expand_dims(y, axis=0)
            self._raw_audio = y.T
            self._sampling_rate = sr
            return y.T, sr
        raise Exception("`Audio` didn't have enough parameters to do request operation")
