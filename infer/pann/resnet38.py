from typing import List

import numpy as np
from pydantic import BaseModel

from audio import Audio
from graph_predict import GraphPredictionRequest, graph_predict
from infer.helpers import log_timer
from infer.pann.sorted_labels import pann_sorted_labels


class PannAudioLabelPrediction(BaseModel):
    label: str
    score: float


@log_timer
def _preprocess(audio: Audio) -> GraphPredictionRequest:
    signal, _ = audio.require_raw(sampling_rate=32000, mono=True)
    signal = signal[None, :]
    return GraphPredictionRequest(
        model_name="pann-resnet38",
        inputs={"raw_audio_data": np.array(signal, dtype=np.float32)},
        output_keys=["output_0"]
    )


@log_timer
def _postprocess(model_result) -> List[PannAudioLabelPrediction]:
    scores = model_result["output_0"][0]
    sorted_indexes = np.argsort(scores)[::-1]
    return [PannAudioLabelPrediction(label=pann_sorted_labels[i], score=scores[i]) for i in sorted_indexes][0:20]


# TODO: simplify this pattern of preprocess, postprocess
def get_audio_tags(audio: Audio) -> List[PannAudioLabelPrediction]:
    return _postprocess(graph_predict(_preprocess(audio)))
