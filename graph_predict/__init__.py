import logging

from graph_predict.grpc_service import get_grpc_prediction
from graph_predict.models import GraphPredictionRequest, ModelResult
from timer import SimpleTimer


def graph_predict(req: GraphPredictionRequest) -> ModelResult:
    # for now just run everything through gRPC
    timer = SimpleTimer()
    timer.start()
    result = get_grpc_prediction(req)

    # TODO: put more details on what method it called
    timer.mark(lambda t: logging.info(f"Graph request for {req.model_name} took {t} seconds..."))

    return result
