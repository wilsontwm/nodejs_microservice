## Generate the protobuf
```
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./app/protobuf/ \
    --grpc_out=grpc_js:./app/protobuf \
    --proto_path=./protos ./protos/**/*.proto
```

## Build the Docker image
Starting from the user directory and execute the following command:
```
docker build -t user-service:latest -f deployment/Dockerfile .
```

## Run the Docker container
```
docker run --name user-service -p 12000:12000 user-service:latest
```

## Create Docker network to allow communications between the containers
```
docker network create nodejs-network
```

## Connect the container to the network
```
docker network connect nodejs-network user-service
```