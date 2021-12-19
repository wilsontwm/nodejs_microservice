## Generate the protobuf
```
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./app/protobuf/ \
    --grpc_out=grpc_js:./app/protobuf \
    --proto_path=./protos ./protos/**/*.proto
```