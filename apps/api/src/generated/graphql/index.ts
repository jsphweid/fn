import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { ReadStream } from "fs-capacitor";
interface GraphQLFileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(options?: {
    encoding?: string;
    highWaterMark?: number;
  }): ReadStream;
}
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: Promise<GraphQLFileUpload>;
};

export type Mutation = {
  __typename?: "Mutation";
  transcribePianoUsingOnsetsAndFrames: Scalars["String"];
  sourceSeparateUsingWavUNetM4: StandardVocalSeparationResponse;
  sourceSeparateUsingWavUNetM5HighSr: StandardVocalSeparationResponse;
  sourceSeparateUsingWavUNetM6: StandardBandSeparationResponse;
  pannAudioTaggingResnet38: Array<StandardAudioTag>;
  mnist: Scalars["Int"];
  adder: Scalars["Float"];
  halfPlusTwo: Array<Scalars["Float"]>;
};

export type MutationTranscribePianoUsingOnsetsAndFramesArgs = {
  file: Scalars["Upload"];
};

export type MutationSourceSeparateUsingWavUNetM4Args = {
  file: Scalars["Upload"];
};

export type MutationSourceSeparateUsingWavUNetM5HighSrArgs = {
  file: Scalars["Upload"];
};

export type MutationSourceSeparateUsingWavUNetM6Args = {
  file: Scalars["Upload"];
};

export type MutationPannAudioTaggingResnet38Args = {
  file: Scalars["Upload"];
};

export type MutationMnistArgs = {
  file: Scalars["Upload"];
};

export type MutationAdderArgs = {
  nums: Array<Scalars["Float"]>;
};

export type MutationHalfPlusTwoArgs = {
  nums: Array<Scalars["Float"]>;
};

export type Query = {
  __typename?: "Query";
  helloworld: Scalars["String"];
};

export type StandardAudioTag = {
  __typename?: "StandardAudioTag";
  label: Scalars["String"];
  score: Scalars["Float"];
};

export type StandardBandSeparationResponse = {
  __typename?: "StandardBandSeparationResponse";
  vocals: Scalars["String"];
  other: Scalars["String"];
  drums: Scalars["String"];
  bass: Scalars["String"];
};

export type StandardVocalSeparationResponse = {
  __typename?: "StandardVocalSeparationResponse";
  vocals: Scalars["String"];
  accompaniment: Scalars["String"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Query: ResolverTypeWrapper<{}>;
  StandardAudioTag: ResolverTypeWrapper<StandardAudioTag>;
  StandardBandSeparationResponse: ResolverTypeWrapper<StandardBandSeparationResponse>;
  StandardVocalSeparationResponse: ResolverTypeWrapper<StandardVocalSeparationResponse>;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: {};
  String: Scalars["String"];
  Int: Scalars["Int"];
  Float: Scalars["Float"];
  Query: {};
  StandardAudioTag: StandardAudioTag;
  StandardBandSeparationResponse: StandardBandSeparationResponse;
  StandardVocalSeparationResponse: StandardVocalSeparationResponse;
  Upload: Scalars["Upload"];
  Boolean: Scalars["Boolean"];
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  transcribePianoUsingOnsetsAndFrames?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType,
    RequireFields<MutationTranscribePianoUsingOnsetsAndFramesArgs, "file">
  >;
  sourceSeparateUsingWavUNetM4?: Resolver<
    ResolversTypes["StandardVocalSeparationResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationSourceSeparateUsingWavUNetM4Args, "file">
  >;
  sourceSeparateUsingWavUNetM5HighSr?: Resolver<
    ResolversTypes["StandardVocalSeparationResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationSourceSeparateUsingWavUNetM5HighSrArgs, "file">
  >;
  sourceSeparateUsingWavUNetM6?: Resolver<
    ResolversTypes["StandardBandSeparationResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationSourceSeparateUsingWavUNetM6Args, "file">
  >;
  pannAudioTaggingResnet38?: Resolver<
    Array<ResolversTypes["StandardAudioTag"]>,
    ParentType,
    ContextType,
    RequireFields<MutationPannAudioTaggingResnet38Args, "file">
  >;
  mnist?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType,
    RequireFields<MutationMnistArgs, "file">
  >;
  adder?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType,
    RequireFields<MutationAdderArgs, "nums">
  >;
  halfPlusTwo?: Resolver<
    Array<ResolversTypes["Float"]>,
    ParentType,
    ContextType,
    RequireFields<MutationHalfPlusTwoArgs, "nums">
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  helloworld?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type StandardAudioTagResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["StandardAudioTag"] = ResolversParentTypes["StandardAudioTag"]
> = {
  label?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  score?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StandardBandSeparationResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["StandardBandSeparationResponse"] = ResolversParentTypes["StandardBandSeparationResponse"]
> = {
  vocals?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  other?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  drums?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  bass?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StandardVocalSeparationResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["StandardVocalSeparationResponse"] = ResolversParentTypes["StandardVocalSeparationResponse"]
> = {
  vocals?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  accompaniment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StandardAudioTag?: StandardAudioTagResolvers<ContextType>;
  StandardBandSeparationResponse?: StandardBandSeparationResponseResolvers<ContextType>;
  StandardVocalSeparationResponse?: StandardVocalSeparationResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
