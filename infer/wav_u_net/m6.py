from audio import Audio
from infer.wav_u_net.configs import full_band_separation_model_config
from infer.wav_u_net.process import process
from type_model import BasicBandSourceSeparationResult


def m6(audio: Audio) -> BasicBandSourceSeparationResult:
    result = process(audio, full_band_separation_model_config, 'wave-u-net-m6')
    return BasicBandSourceSeparationResult(**result)
