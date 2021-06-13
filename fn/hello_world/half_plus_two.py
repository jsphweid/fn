"""
A toy example to make sure things work with graph predictions...
"""
from typing import List

import numpy as np

from graph_predict.tf_grpc_service import TFGraphPredictionRequest, ModelResult, get_tf_grpc_prediction
from fn.helpers import log_timer


@log_timer
def _preprocess(nums: List[float]) -> TFGraphPredictionRequest:
    return TFGraphPredictionRequest(
        model_name="half-plus-two-cpu",
        inputs={"x": np.array(nums, dtype=np.float32)},
        output_keys=["y"]
    )


@log_timer
def _postprocess(model_result: ModelResult) -> List[float]:
    return list(model_result["y"])


def half_plus_two(nums: List[float]) -> List[float]:
    return _postprocess(get_tf_grpc_prediction(_preprocess(nums)))
