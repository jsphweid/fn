from concurrent import futures
import sys
from decimal import Decimal
import grpc
import pytest
import requests
import json

# hack because 1. protoc sucks or 2. I don't know how to use protoc
from fn.file.image import Image

sys.path.insert(0, 'python_grpc_api')

from fn.file.audio import Audio
from fn.file.midi import Midi

from python_grpc_api import service_pb2_grpc, MAX_BYTES, service_pb2
from python_grpc_api.service import Fn
from graph_predict.tf_grpc_service import TF_SERVING_HOST
from graph_predict.ts_grpc_service import TS_SERVING_HOST


@pytest.fixture(scope='session', autouse=True)
def tensorflow_serving():
    # for now, if tensorflow serving's REST API is running, assume gRPC is open on 8500 port as well...
    url = f"http://{TF_SERVING_HOST}:8501/v1/models/half-plus-two-cpu:predict"
    post_data = {"instances": [1.0]}
    try:
        res = requests.post(url, json.dumps(post_data))
        if not res.status_code == 200:
            raise Exception
    except Exception:
        raise Exception("Tensorflow Serving must be running in the background...")


@pytest.fixture(scope='session', autouse=True)
def pytorch_serve():
    url = f"http://{TS_SERVING_HOST}:8080/ping"
    try:
        res = requests.get(url)
        if not res.status_code == 200:
            raise Exception
    except Exception:
        raise Exception("Pytorch Serve must be running in the background...")


@pytest.fixture(scope='session', autouse=True)
def grpc_service_stub():
    options = [('grpc.max_receive_message_length', MAX_BYTES)]
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10), options=options)
    service_pb2_grpc.add_FnServicer_to_server(Fn(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    with grpc.insecure_channel('localhost:50051', options=options) as channel:
        yield service_pb2_grpc.FnStub(channel)
    server.stop(grace=None)


@pytest.fixture(scope='session')
def piano_bytes():
    return Audio.from_local_file("static/piano.wav").to_wav_bytes()


@pytest.fixture(scope='session')
def drums_bytes():
    return Audio.from_local_file("static/drums.wav").to_wav_bytes()


@pytest.fixture(scope='session')
def band_bytes():
    return Audio.from_local_file("static/band.wav").to_wav_bytes()


@pytest.fixture(scope='session')
def img_no4_bytes():
    return Image.from_file("static/4.png").to_png_bytes()


def test_adder(grpc_service_stub):
    result = grpc_service_stub.Adder(service_pb2.AdderRequest(inputs=[1, 2, 3, 4.1]))
    assert Decimal(result.output).quantize(Decimal("1.0")) == Decimal("10.1")


def test_half_plus_two(grpc_service_stub):
    result = grpc_service_stub.HalfPlusTwo(service_pb2.HalfPlusTwoRequest(inputs=[5.0, 7.0]))
    assert result.outputs == [4.5, 5.5]


def test_librosa_transpose(grpc_service_stub, piano_bytes):
    result = grpc_service_stub.LibrosaTranspose(service_pb2.StandardTransposeRequest(
        audio=piano_bytes,
        semitones=2))
    original_y, original_sr = Audio.from_bytes(piano_bytes).require_raw()
    new_y, new_sr = Audio.from_bytes(result.audio).require_raw()
    assert original_sr == new_sr
    assert len(original_y) == len(new_y)
    assert original_y != new_y


def test_onsets_and_frames_drums_transcribe(grpc_service_stub, drums_bytes):
    result = grpc_service_stub.OnsetsAndFramesDrumTranscribe(service_pb2.AudioRequest(audio=drums_bytes))
    assert Midi.from_bytes(result.midi)


def test_onset_and_frames_piano_transcribe(grpc_service_stub, piano_bytes):
    result = grpc_service_stub.OnsetsAndFramesPianoTranscribe(service_pb2.AudioRequest(audio=piano_bytes))
    assert Midi.from_bytes(result.midi)


def test_pann_audio_tagging(grpc_service_stub, piano_bytes):
    result = grpc_service_stub.PannAudioTaggingResnet38(service_pb2.AudioRequest(audio=piano_bytes))
    assert {"Piano", "Music"}.issubset({t.label for t in result.tags})


def test_m4_source_separation(grpc_service_stub, band_bytes):
    result = grpc_service_stub.WavUNetM4SourceSeparation(service_pb2.AudioRequest(audio=band_bytes))
    assert Audio.from_bytes(result.vocals)
    assert Audio.from_bytes(result.accompaniment)


def test_m5_highsr_source_separation(grpc_service_stub, band_bytes):
    result = grpc_service_stub.WavUNetM5HighSrSourceSeparation(service_pb2.AudioRequest(audio=band_bytes))
    assert Audio.from_bytes(result.vocals)
    assert Audio.from_bytes(result.accompaniment)


def test_m6_source_separation(grpc_service_stub, band_bytes):
    result = grpc_service_stub.WavUNetM6SourceSeparation(service_pb2.AudioRequest(audio=band_bytes))
    assert Audio.from_bytes(result.bass)
    assert Audio.from_bytes(result.drums)
    assert Audio.from_bytes(result.other)
    assert Audio.from_bytes(result.vocals)


def test_mnist(grpc_service_stub, img_no4_bytes):
    result = grpc_service_stub.Mnist(service_pb2.ImageRequest(image=img_no4_bytes))
    assert result.int == 4
