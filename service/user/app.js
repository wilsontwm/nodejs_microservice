require('dotenv').config();

const Bootstrap = require('./bootstrap/index');
const Handler = require("./handler/user");

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

const PROTO_PATH = __dirname + '/protos/user.proto';

// Load the proto files
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true,
     includeDirs: [ __dirname + '/protos' ]  
    });
let userProto = grpc.loadPackageDefinition(packageDefinition).user;

async function main() {
    // Initialize the tools
    const bootstrap = new Bootstrap();
    await bootstrap.init();

    let server = new grpc.Server();
    const handler = new Handler(grpc);
    server.addService(userProto.UserService.service, {
        registerUser: handler.register,
        loginUser: handler.loginUser,
        activateUser: handler.activateUser,
        resendActivationCode: handler.resendActivationCode,
        resetPassword: handler.resetPassword,
    })
    
    let address = process.env.HOST + ":" + process.env.PORT;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Server running at " + address);
    });
}

main();