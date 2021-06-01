set -e

#################### python gen stuff
python -m grpc_tools.protoc --proto_path=python_grpc_api --python_out=python_grpc_api --grpc_python_out=python_grpc_api python_grpc_api/service.proto

#################### js gen stuff
rm -rf apps/api/src/generated

cd apps/api
./node_modules/.bin/graphql-codegen --config codegen.yml
cd ../..

PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_GRPC_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"
OUT_DIR="./apps/api/src/generated/grpc-other"
mkdir $OUT_DIR

protoc \
  --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
  --plugin=protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH} \
  --proto_path=python_grpc_api \
  --js_out="import_style=commonjs,binary:${OUT_DIR}" \
  --ts_out="service=grpc-node:${OUT_DIR}" \
  --grpc_out="${OUT_DIR}" \
  service.proto

./node_modules/.bin/prettier --write "apps/api/src/generated/**/*.{ts,js}"
