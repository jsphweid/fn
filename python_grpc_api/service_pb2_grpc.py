# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import service_pb2 as service__pb2


class FnStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.LibrosaTranspose = channel.unary_unary(
                '/Fn/LibrosaTranspose',
                request_serializer=service__pb2.StandardTransposeRequest.SerializeToString,
                response_deserializer=service__pb2.AudioResponse.FromString,
                )
        self.OnsetsAndFramesPianoTranscribe = channel.unary_unary(
                '/Fn/OnsetsAndFramesPianoTranscribe',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.MidiResponse.FromString,
                )
        self.OnsetsAndFramesDrumTranscribe = channel.unary_unary(
                '/Fn/OnsetsAndFramesDrumTranscribe',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.MidiResponse.FromString,
                )
        self.PannAudioTaggingResnet38 = channel.unary_unary(
                '/Fn/PannAudioTaggingResnet38',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.StandardAudioTaggingResponse.FromString,
                )
        self.WavUNetM4SourceSeparation = channel.unary_unary(
                '/Fn/WavUNetM4SourceSeparation',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.StandardVocalSeparationResponse.FromString,
                )
        self.WavUNetM5HighSrSourceSeparation = channel.unary_unary(
                '/Fn/WavUNetM5HighSrSourceSeparation',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.StandardVocalSeparationResponse.FromString,
                )
        self.WavUNetM6SourceSeparation = channel.unary_unary(
                '/Fn/WavUNetM6SourceSeparation',
                request_serializer=service__pb2.AudioRequest.SerializeToString,
                response_deserializer=service__pb2.StandardBandSeparationResponse.FromString,
                )
        self.HalfPlusTwo = channel.unary_unary(
                '/Fn/HalfPlusTwo',
                request_serializer=service__pb2.HalfPlusTwoRequest.SerializeToString,
                response_deserializer=service__pb2.HalfPlusTwoResponse.FromString,
                )
        self.Adder = channel.unary_unary(
                '/Fn/Adder',
                request_serializer=service__pb2.AdderRequest.SerializeToString,
                response_deserializer=service__pb2.AdderResponse.FromString,
                )


class FnServicer(object):
    """Missing associated documentation comment in .proto file."""

    def LibrosaTranspose(self, request, context):
        """audio
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def OnsetsAndFramesPianoTranscribe(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def OnsetsAndFramesDrumTranscribe(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def PannAudioTaggingResnet38(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def WavUNetM4SourceSeparation(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def WavUNetM5HighSrSourceSeparation(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def WavUNetM6SourceSeparation(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def HalfPlusTwo(self, request, context):
        """helloworld
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def Adder(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_FnServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'LibrosaTranspose': grpc.unary_unary_rpc_method_handler(
                    servicer.LibrosaTranspose,
                    request_deserializer=service__pb2.StandardTransposeRequest.FromString,
                    response_serializer=service__pb2.AudioResponse.SerializeToString,
            ),
            'OnsetsAndFramesPianoTranscribe': grpc.unary_unary_rpc_method_handler(
                    servicer.OnsetsAndFramesPianoTranscribe,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.MidiResponse.SerializeToString,
            ),
            'OnsetsAndFramesDrumTranscribe': grpc.unary_unary_rpc_method_handler(
                    servicer.OnsetsAndFramesDrumTranscribe,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.MidiResponse.SerializeToString,
            ),
            'PannAudioTaggingResnet38': grpc.unary_unary_rpc_method_handler(
                    servicer.PannAudioTaggingResnet38,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.StandardAudioTaggingResponse.SerializeToString,
            ),
            'WavUNetM4SourceSeparation': grpc.unary_unary_rpc_method_handler(
                    servicer.WavUNetM4SourceSeparation,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.StandardVocalSeparationResponse.SerializeToString,
            ),
            'WavUNetM5HighSrSourceSeparation': grpc.unary_unary_rpc_method_handler(
                    servicer.WavUNetM5HighSrSourceSeparation,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.StandardVocalSeparationResponse.SerializeToString,
            ),
            'WavUNetM6SourceSeparation': grpc.unary_unary_rpc_method_handler(
                    servicer.WavUNetM6SourceSeparation,
                    request_deserializer=service__pb2.AudioRequest.FromString,
                    response_serializer=service__pb2.StandardBandSeparationResponse.SerializeToString,
            ),
            'HalfPlusTwo': grpc.unary_unary_rpc_method_handler(
                    servicer.HalfPlusTwo,
                    request_deserializer=service__pb2.HalfPlusTwoRequest.FromString,
                    response_serializer=service__pb2.HalfPlusTwoResponse.SerializeToString,
            ),
            'Adder': grpc.unary_unary_rpc_method_handler(
                    servicer.Adder,
                    request_deserializer=service__pb2.AdderRequest.FromString,
                    response_serializer=service__pb2.AdderResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'Fn', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Fn(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def LibrosaTranspose(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/LibrosaTranspose',
            service__pb2.StandardTransposeRequest.SerializeToString,
            service__pb2.AudioResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def OnsetsAndFramesPianoTranscribe(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/OnsetsAndFramesPianoTranscribe',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.MidiResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def OnsetsAndFramesDrumTranscribe(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/OnsetsAndFramesDrumTranscribe',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.MidiResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def PannAudioTaggingResnet38(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/PannAudioTaggingResnet38',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.StandardAudioTaggingResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def WavUNetM4SourceSeparation(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/WavUNetM4SourceSeparation',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.StandardVocalSeparationResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def WavUNetM5HighSrSourceSeparation(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/WavUNetM5HighSrSourceSeparation',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.StandardVocalSeparationResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def WavUNetM6SourceSeparation(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/WavUNetM6SourceSeparation',
            service__pb2.AudioRequest.SerializeToString,
            service__pb2.StandardBandSeparationResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def HalfPlusTwo(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/HalfPlusTwo',
            service__pb2.HalfPlusTwoRequest.SerializeToString,
            service__pb2.HalfPlusTwoResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def Adder(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Fn/Adder',
            service__pb2.AdderRequest.SerializeToString,
            service__pb2.AdderResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)