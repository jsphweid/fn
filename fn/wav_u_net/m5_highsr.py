from audio import Audio
from fn.wav_u_net.configs import voice_separation_model_config
from fn.wav_u_net.process import process
from type_model import VocalSourceSeparationResult


def m5_highsr(audio: Audio) -> VocalSourceSeparationResult:
    result = process(audio, voice_separation_model_config, 'wave-u-net-m5-highsr')
    return VocalSourceSeparationResult(**result)
