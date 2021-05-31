import numpy as np

from graph_predict import GraphPredictionRequest, graph_predict
from fn.helpers import log_timer
from midi import Midi


@log_timer
def _preprocess() -> GraphPredictionRequest:
    return GraphPredictionRequest(
        model_name="piano-transformer-test",
        inputs={
            'targets': np.array([1, 2, 3, 4], dtype=np.int32),
            'decode_length': np.array([1024], dtype=np.int32),
            'input_space_id': np.array([1], dtype=np.int32),
            'target_space_id': np.array([1], dtype=np.int32),
        },
        output_keys=["outputs", "scores"]
    )


@log_timer
def _postprocess(model_result) -> Midi:
    print('-model_result', model_result)
    pass


# TODO: simplify this pattern of preprocess, postprocess
def generate_piano() -> Midi:
    return _postprocess(graph_predict(_preprocess()))
