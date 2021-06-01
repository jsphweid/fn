import grpc from "grpc";

import services from "./generated/grpc/service_grpc_pb";

const PYTHON_GRPC_SERVICE_ADDRESS =
  process.env.PYTHON_GRPC_SERVICE_ADDRESS || "localhost:50051";

export default new services.FnClient(
  PYTHON_GRPC_SERVICE_ADDRESS,
  grpc.credentials.createInsecure(),
  {
    "grpc.max_send_message_length": 10000000,
    "grpc.max_receive_message_length": 10000000,
  }
);
