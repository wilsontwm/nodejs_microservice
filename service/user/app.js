require('dotenv').config();

const Bootstrap = require('./bootstrap/index');
const Handler = require("./handler/user");

const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const userProto = require("./protobuf/user_grpc_pb");

async function main() {
    // Initialize the tools
    const bootstrap = new Bootstrap();
    await bootstrap.init();

    let server = new grpc.Server();
    const handler = new Handler(grpc);
    server.addService(userProto.UserServiceService, {
        registerUser: handler.register,
        loginUser: handler.loginUser,
        activateUser: handler.activateUser,
        resendActivationCode: handler.resendActivationCode,
        forgetPassword: handler.forgetPassword,
        resetPassword: handler.resetPassword,
        verifyToken: handler.verifyToken,
    })
    
    let address = process.env.HOST + ":" + process.env.PORT;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Server running at " + address);
    });
}

main();