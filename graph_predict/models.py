import numpy as np
from typing import Dict, List, Optional

from type_model import TypeModel

DEFAULT_SIGNATURE_NAME = "serving_default"


class GraphPredictionRequest(TypeModel):
    model_name: str
    inputs: Dict[str, np.ndarray]
    output_keys: List[str]
    signature_name: Optional[str]


ModelResult = Dict[str, np.ndarray]
