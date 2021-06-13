import os
from typing import Dict, List, Optional
import numpy as np
import tensorflow as tf
import grpc
from tensorflow_serving.apis import prediction_service_pb2_grpc, predict_pb2

from fn.helpers import log_timer
from type_model import TypeModel

TF_SERVING_HOST = os.getenv("TF_SERVING_HOST", "127.0.0.1")
TF_SERVING_PORT = os.getenv("TF_SERVING_PORT", 8500)
DEFAULT_SIGNATURE_NAME = "serving_default"

channel = grpc.insecure_channel(f"{TF_SERVING_HOST}:{TF_SERVING_PORT}")
stub = prediction_service_pb2_grpc.PredictionServiceStub(channel)


class TFGraphPredictionRequest(TypeModel):
    model_name: str
    inputs: Dict[str, np.ndarray]
    output_keys: List[str]
    signature_name: Optional[str]


ModelResult = Dict[str, np.ndarray]


@log_timer
def get_tf_grpc_prediction(req: TFGraphPredictionRequest) -> ModelResult:
    request = predict_pb2.PredictRequest()
    request.model_spec.name = req.model_name
    request.model_spec.signature_name = req.signature_name if req.signature_name else DEFAULT_SIGNATURE_NAME
    for key, value in req.inputs.items():
        request.inputs[key].CopyFrom(tf.make_tensor_proto(value))
    result = stub.Predict(request)
    return {k: tf.make_ndarray(result.outputs[k]) for k in req.output_keys}
