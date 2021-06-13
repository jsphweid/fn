import os
from typing import Dict
import numpy as np
import grpc

from fn.helpers import log_timer
from graph_predict.ts_grpc_service import inference_pb2, inference_pb2_grpc
from type_model import TypeModel

TS_SERVING_HOST = os.getenv("TS_SERVING_HOST", "127.0.0.1")
TS_SERVING_PORT = os.getenv("TS_SERVING_PORT", 7070)

channel = grpc.insecure_channel(f"{TS_SERVING_HOST}:{TS_SERVING_PORT}")
stub = inference_pb2_grpc.InferenceAPIsServiceStub(channel)


class TSGraphPredictionRequest(TypeModel):
    model_name: str
    inputs: Dict[str, bytes]


ModelResult = Dict[str, np.ndarray]


@log_timer
def get_ts_grpc_prediction(req: TSGraphPredictionRequest):
    response = stub.Predictions(
        inference_pb2.PredictionsRequest(model_name=req.model_name, input=req.inputs))

    # TODO: this isn't a very good system as it's essentially an `any` type
    return response.prediction.decode('utf-8')
