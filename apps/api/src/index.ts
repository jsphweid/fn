import { ApolloServer, gql, makeExecutableSchema } from "apollo-server";
import { ReadStream } from "fs-capacitor";

import { PythonGrpcApi } from "./services/python-grpc-api";
import { FnObjectStore } from "./services/fn-object-store";
import { Utils } from "./utils";
import { Resolvers } from "./generated/graphql";

const readStreamIntoBuffer = async (stream: ReadStream): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const resolvers: Resolvers = {
  Mutation: {
    pannAudioTaggingResnet38: async (_, { file }) => {
      const { createReadStream } = await file;
      const buffer = await readStreamIntoBuffer(createReadStream());
      return PythonGrpcApi.pannAudioTaggingResnet38(buffer).then((result) =>
        result.map((item) => ({
          score: item.getScore(),
          label: item.getLabel(),
        }))
      );
    },
    adder: async (_, { nums }) => PythonGrpcApi.adder(nums),
    halfPlusTwo: async (_, { nums }) => PythonGrpcApi.halfPlusTwo(nums),
    transcribePianoUsingOnsetsAndFrames: async (_, { file }) => {
      // TODO: do a quick check to make sure incoming file is audio...?
      const { createReadStream, filename, mimetype, encoding } = await file;
      const buffer = await readStreamIntoBuffer(createReadStream());
      const midiFile = await PythonGrpcApi.onsetsAndFramesPianoTranscribe(
        buffer
      );
      const objectKey = `${Utils.getUniqueId()}.midi`;
      await FnObjectStore.set(objectKey, midiFile);
      return FnObjectStore.getSignedUrl(objectKey);
    },
    sourceSeparateUsingWavUNetM4: async (_, { file }) => {
      const { createReadStream } = await file;
      const buffer = await readStreamIntoBuffer(createReadStream());
      const result = await PythonGrpcApi.wavUNetM4SourceSeparation(buffer);
      const accompanimentObjectKey = `${Utils.getUniqueId()}.wav`;
      const vocalObjectKey = `${Utils.getUniqueId()}.wav`;
      await Promise.all([
        FnObjectStore.set(accompanimentObjectKey, result.accompaniment),
        FnObjectStore.set(vocalObjectKey, result.vocals),
      ]);
      return Promise.all([
        FnObjectStore.getSignedUrl(accompanimentObjectKey),
        FnObjectStore.getSignedUrl(vocalObjectKey),
      ]).then(([accompaniment, vocals]) => ({ accompaniment, vocals }));
    },
    sourceSeparateUsingWavUNetM5HighSr: async (_, { file }) => {
      const { createReadStream } = await file;
      const buffer = await readStreamIntoBuffer(createReadStream());
      const result = await PythonGrpcApi.wavUNetM5SourceSeparationHighSr(
        buffer
      );
      const accompanimentObjectKey = `${Utils.getUniqueId()}.wav`;
      const vocalObjectKey = `${Utils.getUniqueId()}.wav`;
      await Promise.all([
        FnObjectStore.set(accompanimentObjectKey, result.accompaniment),
        FnObjectStore.set(vocalObjectKey, result.vocals),
      ]);
      return Promise.all([
        FnObjectStore.getSignedUrl(accompanimentObjectKey),
        FnObjectStore.getSignedUrl(vocalObjectKey),
      ]).then(([accompaniment, vocals]) => ({ accompaniment, vocals }));
    },
    sourceSeparateUsingWavUNetM6: async (_, { file }) => {
      const { createReadStream } = await file;
      const buffer = await readStreamIntoBuffer(createReadStream());
      const result = await PythonGrpcApi.wavUNetM6SourceSeparation(buffer);
      const otherObjectKey = `${Utils.getUniqueId()}.wav`;
      const bassObjectKey = `${Utils.getUniqueId()}.wav`;
      const drumsObjectKey = `${Utils.getUniqueId()}.wav`;
      const vocalObjectKey = `${Utils.getUniqueId()}.wav`;
      await Promise.all([
        FnObjectStore.set(otherObjectKey, result.other),
        FnObjectStore.set(bassObjectKey, result.bass),
        FnObjectStore.set(drumsObjectKey, result.drums),
        FnObjectStore.set(vocalObjectKey, result.vocals),
      ]);
      return Promise.all([
        FnObjectStore.getSignedUrl(otherObjectKey),
        FnObjectStore.getSignedUrl(bassObjectKey),
        FnObjectStore.getSignedUrl(drumsObjectKey),
        FnObjectStore.getSignedUrl(vocalObjectKey),
      ]).then(([other, bass, drums, vocals]) => ({
        other,
        bass,
        drums,
        vocals,
      }));
    },
  },
};

const typeDefs = gql`
  scalar Upload

  type StandardVocalSeparationResponse {
    vocals: String!
    accompaniment: String!
  }

  type StandardBandSeparationResponse {
    vocals: String!
    other: String!
    drums: String!
    bass: String!
  }

  type Query {
    helloworld: String!
  }

  type StandardAudioTag {
    label: String!
    score: Float!
  }

  type Mutation {
    transcribePianoUsingOnsetsAndFrames(file: Upload!): String!
    sourceSeparateUsingWavUNetM4(
      file: Upload!
    ): StandardVocalSeparationResponse!
    sourceSeparateUsingWavUNetM5HighSr(
      file: Upload!
    ): StandardVocalSeparationResponse!
    sourceSeparateUsingWavUNetM6(file: Upload!): StandardBandSeparationResponse!
    pannAudioTaggingResnet38(file: Upload!): [StandardAudioTag!]!
    adder(nums: [Float!]!): Float!
    halfPlusTwo(nums: [Float!]!): [Float!]!
  }
`;

const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers: resolvers as any }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
