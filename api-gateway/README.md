
## Build the Docker image
Starting from the api-gateway directory and execute the following command:
```
docker build -t node-api:latest -f deployment/Dockerfile .
```

## Run the Docker container
```
docker run --name node-api -p 3000:3000 node-api:latest
```

## Create Docker network to allow communications between the containers
```
docker network create nodejs-network
```

## Connect the container to the network
```
docker network connect nodejs-network node-api
```