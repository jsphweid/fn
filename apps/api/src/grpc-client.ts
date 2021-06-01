import * as grpc from "@grpc/grpc-js";
import { FnClient } from "./generated/grpc/Fn";

export default new FnClient(
  `localhost:${process.env.PORT}`,
  grpc.credentials.createInsecure()
);
