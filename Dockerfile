FROM python:3.8-slim-buster

RUN apt-get update && \
  apt-get install -y liblo-dev librtmidi-dev build-essential python-dev libasound2-dev

WORKDIR /app
COPY file file
COPY fn fn
COPY graph_predict graph_predict
COPY python_grpc_api python_grpc_api
COPY requirements.txt requirements.txt
COPY run_python_grpc_service.py run_python_grpc_service.py
COPY type_model.py type_model.py
COPY timer.py timer.py 

RUN pip install -r requirements.txt
CMD ["python", "run_python_grpc_service.py"]
