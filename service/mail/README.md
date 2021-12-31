## Generate the protobuf
```
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./app/protobuf/ \
    --grpc_out=grpc_js:./app/protobuf \
    --proto_path=./protos ./protos/**/*.proto
```

## Build the Docker image
Starting from the mail directory and execute the following command:
```
docker build -t mail-service:latest -f deployment/Dockerfile .
```

## Run the Docker container
```
docker run --name mail-service -p 12000:12000 mail-service:latest
```

## Create Docker network to allow communications between the containers
```
docker network create nodejs-network
```

## Connect the container to the network
```
docker network connect nodejs-network mail-service
```