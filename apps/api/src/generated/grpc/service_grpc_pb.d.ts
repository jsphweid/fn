// package:
// file: service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as service_pb from "./service_pb";

interface IFnService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  librosaTranspose: IFnService_ILibrosaTranspose;
  onsetsAndFramesPianoTranscribe: IFnService_IOnsetsAndFramesPianoTranscribe;
  onsetsAndFramesDrumTranscribe: IFnService_IOnsetsAndFramesDrumTranscribe;
  pannAudioTaggingResnet38: IFnService_IPannAudioTaggingResnet38;
  wavUNetM4SourceSeparation: IFnService_IWavUNetM4SourceSeparation;
  wavUNetM5HighSrSourceSeparation: IFnService_IWavUNetM5HighSrSourceSeparation;
  wavUNetM6SourceSeparation: IFnService_IWavUNetM6SourceSeparation;
  halfPlusTwo: IFnService_IHalfPlusTwo;
  adder: IFnService_IAdder;
  mnist: IFnService_IMnist;
}

interface IFnService_ILibrosaTranspose
  extends grpc.MethodDefinition<
    service_pb.StandardTransposeRequest,
    service_pb.AudioResponse
  > {
  path: "/Fn/LibrosaTranspose";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.StandardTransposeRequest>;
  requestDeserialize: grpc.deserialize<service_pb.StandardTransposeRequest>;
  responseSerialize: grpc.serialize<service_pb.AudioResponse>;
  responseDeserialize: grpc.deserialize<service_pb.AudioResponse>;
}
interface IFnService_IOnsetsAndFramesPianoTranscribe
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.MidiResponse
  > {
  path: "/Fn/OnsetsAndFramesPianoTranscribe";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.MidiResponse>;
  responseDeserialize: grpc.deserialize<service_pb.MidiResponse>;
}
interface IFnService_IOnsetsAndFramesDrumTranscribe
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.MidiResponse
  > {
  path: "/Fn/OnsetsAndFramesDrumTranscribe";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.MidiResponse>;
  responseDeserialize: grpc.deserialize<service_pb.MidiResponse>;
}
interface IFnService_IPannAudioTaggingResnet38
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.StandardAudioTaggingResponse
  > {
  path: "/Fn/PannAudioTaggingResnet38";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.StandardAudioTaggingResponse>;
  responseDeserialize: grpc.deserialize<service_pb.StandardAudioTaggingResponse>;
}
interface IFnService_IWavUNetM4SourceSeparation
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.StandardVocalSeparationResponse
  > {
  path: "/Fn/WavUNetM4SourceSeparation";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.StandardVocalSeparationResponse>;
  responseDeserialize: grpc.deserialize<service_pb.StandardVocalSeparationResponse>;
}
interface IFnService_IWavUNetM5HighSrSourceSeparation
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.StandardVocalSeparationResponse
  > {
  path: "/Fn/WavUNetM5HighSrSourceSeparation";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.StandardVocalSeparationResponse>;
  responseDeserialize: grpc.deserialize<service_pb.StandardVocalSeparationResponse>;
}
interface IFnService_IWavUNetM6SourceSeparation
  extends grpc.MethodDefinition<
    service_pb.AudioRequest,
    service_pb.StandardBandSeparationResponse
  > {
  path: "/Fn/WavUNetM6SourceSeparation";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AudioRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AudioRequest>;
  responseSerialize: grpc.serialize<service_pb.StandardBandSeparationResponse>;
  responseDeserialize: grpc.deserialize<service_pb.StandardBandSeparationResponse>;
}
interface IFnService_IHalfPlusTwo
  extends grpc.MethodDefinition<
    service_pb.HalfPlusTwoRequest,
    service_pb.HalfPlusTwoResponse
  > {
  path: "/Fn/HalfPlusTwo";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.HalfPlusTwoRequest>;
  requestDeserialize: grpc.deserialize<service_pb.HalfPlusTwoRequest>;
  responseSerialize: grpc.serialize<service_pb.HalfPlusTwoResponse>;
  responseDeserialize: grpc.deserialize<service_pb.HalfPlusTwoResponse>;
}
interface IFnService_IAdder
  extends grpc.MethodDefinition<
    service_pb.AdderRequest,
    service_pb.AdderResponse
  > {
  path: "/Fn/Adder";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.AdderRequest>;
  requestDeserialize: grpc.deserialize<service_pb.AdderRequest>;
  responseSerialize: grpc.serialize<service_pb.AdderResponse>;
  responseDeserialize: grpc.deserialize<service_pb.AdderResponse>;
}
interface IFnService_IMnist
  extends grpc.MethodDefinition<
    service_pb.ImageRequest,
    service_pb.IntResponse
  > {
  path: "/Fn/Mnist";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<service_pb.ImageRequest>;
  requestDeserialize: grpc.deserialize<service_pb.ImageRequest>;
  responseSerialize: grpc.serialize<service_pb.IntResponse>;
  responseDeserialize: grpc.deserialize<service_pb.IntResponse>;
}

export const FnService: IFnService;

export interface IFnServer {
  librosaTranspose: grpc.handleUnaryCall<
    service_pb.StandardTransposeRequest,
    service_pb.AudioResponse
  >;
  onsetsAndFramesPianoTranscribe: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.MidiResponse
  >;
  onsetsAndFramesDrumTranscribe: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.MidiResponse
  >;
  pannAudioTaggingResnet38: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.StandardAudioTaggingResponse
  >;
  wavUNetM4SourceSeparation: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.StandardVocalSeparationResponse
  >;
  wavUNetM5HighSrSourceSeparation: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.StandardVocalSeparationResponse
  >;
  wavUNetM6SourceSeparation: grpc.handleUnaryCall<
    service_pb.AudioRequest,
    service_pb.StandardBandSeparationResponse
  >;
  halfPlusTwo: grpc.handleUnaryCall<
    service_pb.HalfPlusTwoRequest,
    service_pb.HalfPlusTwoResponse
  >;
  adder: grpc.handleUnaryCall<
    service_pb.AdderRequest,
    service_pb.AdderResponse
  >;
  mnist: grpc.handleUnaryCall<service_pb.ImageRequest, service_pb.IntResponse>;
}

export interface IFnClient {
  librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  adder(
    request: service_pb.AdderRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  adder(
    request: service_pb.AdderRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  adder(
    request: service_pb.AdderRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  mnist(
    request: service_pb.ImageRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
  mnist(
    request: service_pb.ImageRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
  mnist(
    request: service_pb.ImageRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
}

export class FnClient extends grpc.Client implements IFnClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: object
  );
  public librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public librosaTranspose(
    request: service_pb.StandardTransposeRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AudioResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesPianoTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public onsetsAndFramesDrumTranscribe(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.MidiResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public pannAudioTaggingResnet38(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardAudioTaggingResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM4SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM5HighSrSourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardVocalSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public wavUNetM6SourceSeparation(
    request: service_pb.AudioRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.StandardBandSeparationResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public halfPlusTwo(
    request: service_pb.HalfPlusTwoRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.HalfPlusTwoResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public adder(
    request: service_pb.AdderRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public adder(
    request: service_pb.AdderRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public adder(
    request: service_pb.AdderRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.AdderResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public mnist(
    request: service_pb.ImageRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public mnist(
    request: service_pb.ImageRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public mnist(
    request: service_pb.ImageRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: service_pb.IntResponse
    ) => void
  ): grpc.ClientUnaryCall;
}
