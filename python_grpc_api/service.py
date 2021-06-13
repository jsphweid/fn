from concurrent import futures
import grpc

from file.audio import Audio
from file.image import Image
from fn.hello_world.adder import adder
from fn.hello_world.half_plus_two import half_plus_two
from fn.hello_world.mnist import mnist
from fn.librosa_fns import librosa_transpose
from fn.onsets_and_frames.drums import transcribe_drums
from fn.onsets_and_frames.piano import transcribe_piano
from fn.pann.resnet38 import get_audio_tags
from fn.wav_u_net.m4 import m4
from fn.wav_u_net.m5_highsr import m5_highsr
from fn.wav_u_net.m6 import m6
from python_grpc_api import service_pb2, service_pb2_grpc, MAX_BYTES


class Fn(service_pb2_grpc.FnServicer):

    def HalfPlusTwo(self, request, context):
        return service_pb2.HalfPlusTwoResponse(outputs=half_plus_two(request.inputs))

    def Adder(self, request, context):
        return service_pb2.AdderResponse(output=adder(request.inputs))

    def LibrosaTranspose(self, request, context):
        result = librosa_transpose(Audio.from_bytes(request.audio), request.semitones)
        return service_pb2.AudioResponse(audio=result.to_wav_bytes())

    def OnsetsAndFramesDrumTranscribe(self, request, context):
        midi = transcribe_drums(Audio.from_bytes(request.audio))
        return service_pb2.MidiResponse(midi=midi.to_bytes())

    def OnsetsAndFramesPianoTranscribe(self, request, context):
        midi = transcribe_piano(Audio.from_bytes(request.audio))
        return service_pb2.MidiResponse(midi=midi.to_bytes())

    def PannAudioTaggingResnet38(self, request, context):
        audio = Audio.from_bytes(request.audio)
        tags = [service_pb2.StandardAudioTag(label=t.label, score=t.score) for t in get_audio_tags(audio)]
        return service_pb2.StandardAudioTaggingResponse(tags=tags)

    def WavUNetM4SourceSeparation(self, request, context):
        result = m4(Audio.from_bytes(request.audio))
        return service_pb2.StandardVocalSeparationResponse(
            vocals=result.vocals.to_wav_bytes(),
            accompaniment=result.accompaniment.to_wav_bytes())

    def WavUNetM5HighSrSourceSeparation(self, request, context):
        result = m5_highsr(Audio.from_bytes(request.audio))
        return service_pb2.StandardVocalSeparationResponse(
            vocals=result.vocals.to_wav_bytes(),
            accompaniment=result.accompaniment.to_wav_bytes())

    def WavUNetM6SourceSeparation(self, request, context):
        result = m6(Audio.from_bytes(request.audio))
        return service_pb2.StandardBandSeparationResponse(
            bass=result.bass.to_wav_bytes(),
            drums=result.drums.to_wav_bytes(),
            other=result.other.to_wav_bytes(),
            vocals=result.vocals.to_wav_bytes())

    def Mnist(self, request, context):
        return service_pb2.IntResponse(int=mnist(Image.from_bytes(request.image)))


def serve():
    options = [('grpc.max_receive_message_length', MAX_BYTES)]
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10), options=options)
    service_pb2_grpc.add_FnServicer_to_server(Fn(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()
