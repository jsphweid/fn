"""
A toy example to make sure things work with graph predictions...
"""
from typing import List

import numpy as np

from graph_predict import GraphPredictionRequest, ModelResult, graph_predict
from infer.helpers import log_timer


@log_timer
def _preprocess(nums: List[float]) -> GraphPredictionRequest:
    return GraphPredictionRequest(
        model_name="half-plus-two-cpu",
        inputs={"x": np.array(nums, dtype=np.float32)},
        output_keys=["y"]
    )


@log_timer
def _postprocess(model_result: ModelResult) -> List[float]:
    return list(model_result["y"])


def half_plus_two(nums: List[float]) -> List[float]:
    return _postprocess(graph_predict(_preprocess(nums)))
