import grpc from "grpc";

import services from "./generated/grpc/service_grpc_pb";

const GRPC_HOST = process.env.GRPC_HOST || "localhost";
const GRPC_PORT = process.env.GRPC_PORT || 50051;

export default new services.FnClient(
  `${GRPC_HOST}:${GRPC_PORT}`,
  grpc.credentials.createInsecure(),
  {
    "grpc.max_send_message_length": 10000000,
    "grpc.max_receive_message_length": 10000000,
  }
);
