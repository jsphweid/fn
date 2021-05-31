from audio import Audio
from infer.wav_u_net.configs import baseline_voice_separation_model_config
from infer.wav_u_net.process import process
from type_model import VocalSourceSeparationResult


def m4(audio: Audio) -> VocalSourceSeparationResult:
    result = process(audio, baseline_voice_separation_model_config, 'wave-u-net-m4')
    return VocalSourceSeparationResult(**result)
