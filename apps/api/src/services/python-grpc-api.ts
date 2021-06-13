import { promisify } from "util";

import {
  HalfPlusTwoRequest,
  HalfPlusTwoResponse,
  ImageRequest,
  IntResponse,
} from "../generated/grpc/service_pb";
import {
  AdderRequest,
  AdderResponse,
  StandardAudioTag,
  StandardAudioTaggingResponse,
  StandardBandSeparationResponse,
} from "../generated/grpc/service_pb";
import {
  AudioRequest,
  MidiResponse,
  StandardVocalSeparationResponse,
} from "../generated/grpc/service_pb";
import grpcClient from "../grpc-client";

const bufferToAudioRequest = (audio: Buffer): AudioRequest => {
  const req = new AudioRequest();
  req.setAudio(audio);
  return req;
};

const bufferToImageRequest = (image: Buffer): ImageRequest => {
  const req = new ImageRequest();
  req.setImage(image);
  return req;
};

export namespace PythonGrpcApi {
  // TODO: maybe autogen or automate this somehow
  const onsetsAndFramesPianoTranscribeFn = promisify<
    AudioRequest,
    MidiResponse
  >(grpcClient.onsetsAndFramesPianoTranscribe).bind(grpcClient);

  const wavUNetM4SourceSeparationFn = promisify<
    AudioRequest,
    StandardVocalSeparationResponse
  >(grpcClient.wavUNetM4SourceSeparation).bind(grpcClient);

  const wavUNetM5HighSrSourceSeparationFn = promisify<
    AudioRequest,
    StandardVocalSeparationResponse
  >(grpcClient.wavUNetM5HighSrSourceSeparation).bind(grpcClient);

  const wavUNetM6SourceSeparationFn = promisify<
    AudioRequest,
    StandardBandSeparationResponse
  >(grpcClient.wavUNetM6SourceSeparation).bind(grpcClient);

  const pannAudioTaggingResnet38Fn = promisify<
    AudioRequest,
    StandardAudioTaggingResponse
  >(grpcClient.pannAudioTaggingResnet38).bind(grpcClient);

  const halfPlusTwoFn = promisify<HalfPlusTwoRequest, HalfPlusTwoResponse>(
    grpcClient.halfPlusTwo
  ).bind(grpcClient);

  const adderFn = promisify<AdderRequest, AdderResponse>(grpcClient.adder).bind(
    grpcClient
  );

  const mnistFn = promisify<ImageRequest, IntResponse>(grpcClient.mnist).bind(
    grpcClient
  );

  // public
  export const onsetsAndFramesPianoTranscribe = (
    audio: Buffer
  ): Promise<Buffer> =>
    onsetsAndFramesPianoTranscribeFn(bufferToAudioRequest(audio)).then((res) =>
      Buffer.from(res.getMidi())
    );

  export const adder = (nums: number[]): Promise<number> => {
    const req = new AdderRequest();
    req.setInputsList(nums);
    return adderFn(req).then((res) => res.getOutput());
  };

  export const halfPlusTwo = (nums: number[]): Promise<number[]> => {
    const req = new HalfPlusTwoRequest();
    req.setInputsList(nums);
    return halfPlusTwoFn(req).then((res) => res.getOutputsList());
  };

  export const wavUNetM4SourceSeparation = (
    audio: Buffer
  ): Promise<{ accompaniment: Buffer; vocals: Buffer }> =>
    wavUNetM4SourceSeparationFn(bufferToAudioRequest(audio)).then((res) => ({
      accompaniment: Buffer.from(res.getAccompaniment()),
      vocals: Buffer.from(res.getVocals()),
    }));

  export const wavUNetM5SourceSeparationHighSr = (
    audio: Buffer
  ): Promise<{ accompaniment: Buffer; vocals: Buffer }> =>
    wavUNetM5HighSrSourceSeparationFn(bufferToAudioRequest(audio)).then(
      (res) => ({
        accompaniment: Buffer.from(res.getAccompaniment()),
        vocals: Buffer.from(res.getVocals()),
      })
    );

  export const wavUNetM6SourceSeparation = (
    audio: Buffer
  ): Promise<{ bass: Buffer; vocals: Buffer; drums: Buffer; other: Buffer }> =>
    wavUNetM6SourceSeparationFn(bufferToAudioRequest(audio)).then((res) => ({
      bass: Buffer.from(res.getBass()),
      vocals: Buffer.from(res.getVocals()),
      other: Buffer.from(res.getOther()),
      drums: Buffer.from(res.getDrums()),
    }));

  export const pannAudioTaggingResnet38 = (
    audio: Buffer
  ): Promise<StandardAudioTag[]> =>
    pannAudioTaggingResnet38Fn(bufferToAudioRequest(audio)).then((res) =>
      res.getTagsList()
    );

  export const mnist = (image: Buffer): Promise<number> =>
    mnistFn(bufferToImageRequest(image)).then((res) => res.getInt());
}
