import os
import tensorflow as tf
import grpc
from tensorflow_serving.apis import prediction_service_pb2_grpc, predict_pb2

from graph_predict.models import GraphPredictionRequest, DEFAULT_SIGNATURE_NAME, ModelResult

TENSORFLOW_SERVING_IP = os.getenv("TENSORFLOW_SERVING_IP", "127.0.0.1")
TENSORFLOW_SERVING_PORT = os.getenv("TENSORFLOW_SERVING_PORT", 8500)

channel = grpc.insecure_channel(f"{TENSORFLOW_SERVING_IP}:{TENSORFLOW_SERVING_PORT}")
stub = prediction_service_pb2_grpc.PredictionServiceStub(channel)


def get_grpc_prediction(req: GraphPredictionRequest) -> ModelResult:
    request = predict_pb2.PredictRequest()
    request.model_spec.name = req.model_name
    request.model_spec.signature_name = req.signature_name if req.signature_name else DEFAULT_SIGNATURE_NAME
    for key, value in req.inputs.items():
        request.inputs[key].CopyFrom(tf.make_tensor_proto(value))
    result = stub.Predict(request)
    return {k: tf.make_ndarray(result.outputs[k]) for k in req.output_keys}
