require('dotenv').config();

const Bootstrap = require('./bootstrap/index');
const Handler = require("./handler/user");
const Services = require('./services/index');

const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const userProto = require("./protobuf/user_grpc_pb");

async function main() {
    // Initialize the tools
    const bootstrap = new Bootstrap();
    await bootstrap.init();

    const services = new Services();

    let server = new grpc.Server();
    const handler = new Handler(grpc, bootstrap, services);
    server.addService(userProto.UserServiceService, {
        registerUser: handler.register,
        loginUser: handler.loginUser,
        activateUser: handler.activateUser,
        resendActivationCode: handler.resendActivationCode,
        forgetPassword: handler.forgetPassword,
        resetPassword: handler.resetPassword,
        verifyToken: handler.verifyToken,
        googleOAuth: handler.googleOAuth,
        googleOAuthCallback: handler.googleOAuthCallback,
    })
    
    let address = process.env.SERVICE_USER;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Server running at " + address);
    });
}

main();