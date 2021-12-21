## Generate the protobuf in Javascript
```
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./generated/js/ \
    --grpc_out=grpc_js:./generated/js \
    --proto_path=./protos ./protos/**/*.proto
```