import logging
import asyncio

# hack because 1. protoc sucks or 2. I don't know how to use protoc
import sys
sys.path.insert(0, 'python_grpc_api')

from python_grpc_api.service import serve

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    # asyncio.run(serve())
    serve()
