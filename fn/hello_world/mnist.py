from fn.file.image import Image
from graph_predict.ts_grpc_service import get_ts_grpc_prediction, TSGraphPredictionRequest


def _preprocess(image: Image) -> TSGraphPredictionRequest:
    return TSGraphPredictionRequest(model_name="mnist", inputs={"data": image.to_png_bytes()})


def _postprocess(prediction_result) -> int:
    return int(prediction_result)


def mnist(image: Image) -> int:
    return _postprocess(get_ts_grpc_prediction(_preprocess(image)))
