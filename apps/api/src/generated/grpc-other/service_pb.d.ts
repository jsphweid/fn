// package:
// file: service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class StandardVocalSeparationResponse extends jspb.Message {
  getVocals(): Uint8Array | string;
  getVocals_asU8(): Uint8Array;
  getVocals_asB64(): string;
  setVocals(value: Uint8Array | string): StandardVocalSeparationResponse;
  getAccompaniment(): Uint8Array | string;
  getAccompaniment_asU8(): Uint8Array;
  getAccompaniment_asB64(): string;
  setAccompaniment(value: Uint8Array | string): StandardVocalSeparationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandardVocalSeparationResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StandardVocalSeparationResponse
  ): StandardVocalSeparationResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StandardVocalSeparationResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StandardVocalSeparationResponse;
  static deserializeBinaryFromReader(
    message: StandardVocalSeparationResponse,
    reader: jspb.BinaryReader
  ): StandardVocalSeparationResponse;
}

export namespace StandardVocalSeparationResponse {
  export type AsObject = {
    vocals: Uint8Array | string;
    accompaniment: Uint8Array | string;
  };
}

export class StandardBandSeparationResponse extends jspb.Message {
  getBass(): Uint8Array | string;
  getBass_asU8(): Uint8Array;
  getBass_asB64(): string;
  setBass(value: Uint8Array | string): StandardBandSeparationResponse;
  getDrums(): Uint8Array | string;
  getDrums_asU8(): Uint8Array;
  getDrums_asB64(): string;
  setDrums(value: Uint8Array | string): StandardBandSeparationResponse;
  getOther(): Uint8Array | string;
  getOther_asU8(): Uint8Array;
  getOther_asB64(): string;
  setOther(value: Uint8Array | string): StandardBandSeparationResponse;
  getVocals(): Uint8Array | string;
  getVocals_asU8(): Uint8Array;
  getVocals_asB64(): string;
  setVocals(value: Uint8Array | string): StandardBandSeparationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandardBandSeparationResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StandardBandSeparationResponse
  ): StandardBandSeparationResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StandardBandSeparationResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StandardBandSeparationResponse;
  static deserializeBinaryFromReader(
    message: StandardBandSeparationResponse,
    reader: jspb.BinaryReader
  ): StandardBandSeparationResponse;
}

export namespace StandardBandSeparationResponse {
  export type AsObject = {
    bass: Uint8Array | string;
    drums: Uint8Array | string;
    other: Uint8Array | string;
    vocals: Uint8Array | string;
  };
}

export class StandardTransposeRequest extends jspb.Message {
  getAudio(): Uint8Array | string;
  getAudio_asU8(): Uint8Array;
  getAudio_asB64(): string;
  setAudio(value: Uint8Array | string): StandardTransposeRequest;
  getSemitones(): number;
  setSemitones(value: number): StandardTransposeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandardTransposeRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StandardTransposeRequest
  ): StandardTransposeRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StandardTransposeRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StandardTransposeRequest;
  static deserializeBinaryFromReader(
    message: StandardTransposeRequest,
    reader: jspb.BinaryReader
  ): StandardTransposeRequest;
}

export namespace StandardTransposeRequest {
  export type AsObject = {
    audio: Uint8Array | string;
    semitones: number;
  };
}

export class AudioRequest extends jspb.Message {
  getAudio(): Uint8Array | string;
  getAudio_asU8(): Uint8Array;
  getAudio_asB64(): string;
  setAudio(value: Uint8Array | string): AudioRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AudioRequest
  ): AudioRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AudioRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AudioRequest;
  static deserializeBinaryFromReader(
    message: AudioRequest,
    reader: jspb.BinaryReader
  ): AudioRequest;
}

export namespace AudioRequest {
  export type AsObject = {
    audio: Uint8Array | string;
  };
}

export class AudioResponse extends jspb.Message {
  getAudio(): Uint8Array | string;
  getAudio_asU8(): Uint8Array;
  getAudio_asB64(): string;
  setAudio(value: Uint8Array | string): AudioResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AudioResponse
  ): AudioResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AudioResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AudioResponse;
  static deserializeBinaryFromReader(
    message: AudioResponse,
    reader: jspb.BinaryReader
  ): AudioResponse;
}

export namespace AudioResponse {
  export type AsObject = {
    audio: Uint8Array | string;
  };
}

export class MidiResponse extends jspb.Message {
  getMidi(): Uint8Array | string;
  getMidi_asU8(): Uint8Array;
  getMidi_asB64(): string;
  setMidi(value: Uint8Array | string): MidiResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MidiResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: MidiResponse
  ): MidiResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: MidiResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): MidiResponse;
  static deserializeBinaryFromReader(
    message: MidiResponse,
    reader: jspb.BinaryReader
  ): MidiResponse;
}

export namespace MidiResponse {
  export type AsObject = {
    midi: Uint8Array | string;
  };
}

export class HalfPlusTwoRequest extends jspb.Message {
  clearInputsList(): void;
  getInputsList(): Array<number>;
  setInputsList(value: Array<number>): HalfPlusTwoRequest;
  addInputs(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HalfPlusTwoRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: HalfPlusTwoRequest
  ): HalfPlusTwoRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: HalfPlusTwoRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): HalfPlusTwoRequest;
  static deserializeBinaryFromReader(
    message: HalfPlusTwoRequest,
    reader: jspb.BinaryReader
  ): HalfPlusTwoRequest;
}

export namespace HalfPlusTwoRequest {
  export type AsObject = {
    inputsList: Array<number>;
  };
}

export class HalfPlusTwoResponse extends jspb.Message {
  clearOutputsList(): void;
  getOutputsList(): Array<number>;
  setOutputsList(value: Array<number>): HalfPlusTwoResponse;
  addOutputs(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HalfPlusTwoResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: HalfPlusTwoResponse
  ): HalfPlusTwoResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: HalfPlusTwoResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): HalfPlusTwoResponse;
  static deserializeBinaryFromReader(
    message: HalfPlusTwoResponse,
    reader: jspb.BinaryReader
  ): HalfPlusTwoResponse;
}

export namespace HalfPlusTwoResponse {
  export type AsObject = {
    outputsList: Array<number>;
  };
}

export class AdderRequest extends jspb.Message {
  clearInputsList(): void;
  getInputsList(): Array<number>;
  setInputsList(value: Array<number>): AdderRequest;
  addInputs(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdderRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AdderRequest
  ): AdderRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AdderRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AdderRequest;
  static deserializeBinaryFromReader(
    message: AdderRequest,
    reader: jspb.BinaryReader
  ): AdderRequest;
}

export namespace AdderRequest {
  export type AsObject = {
    inputsList: Array<number>;
  };
}

export class AdderResponse extends jspb.Message {
  getOutput(): number;
  setOutput(value: number): AdderResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdderResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AdderResponse
  ): AdderResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AdderResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AdderResponse;
  static deserializeBinaryFromReader(
    message: AdderResponse,
    reader: jspb.BinaryReader
  ): AdderResponse;
}

export namespace AdderResponse {
  export type AsObject = {
    output: number;
  };
}

export class StandardAudioTag extends jspb.Message {
  getLabel(): string;
  setLabel(value: string): StandardAudioTag;
  getScore(): number;
  setScore(value: number): StandardAudioTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandardAudioTag.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StandardAudioTag
  ): StandardAudioTag.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StandardAudioTag,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StandardAudioTag;
  static deserializeBinaryFromReader(
    message: StandardAudioTag,
    reader: jspb.BinaryReader
  ): StandardAudioTag;
}

export namespace StandardAudioTag {
  export type AsObject = {
    label: string;
    score: number;
  };
}

export class StandardAudioTaggingResponse extends jspb.Message {
  clearTagsList(): void;
  getTagsList(): Array<StandardAudioTag>;
  setTagsList(value: Array<StandardAudioTag>): StandardAudioTaggingResponse;
  addTags(value?: StandardAudioTag, index?: number): StandardAudioTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandardAudioTaggingResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StandardAudioTaggingResponse
  ): StandardAudioTaggingResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StandardAudioTaggingResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StandardAudioTaggingResponse;
  static deserializeBinaryFromReader(
    message: StandardAudioTaggingResponse,
    reader: jspb.BinaryReader
  ): StandardAudioTaggingResponse;
}

export namespace StandardAudioTaggingResponse {
  export type AsObject = {
    tagsList: Array<StandardAudioTag.AsObject>;
  };
}
