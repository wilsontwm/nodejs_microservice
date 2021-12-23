require('dotenv').config();

// const Bootstrap = require('./bootstrap/index');
const Handler = require("./handler/mail");

const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const mailProto = require("./protobuf/mail_grpc_pb");
// const grpc = require('grpc');
// const protoLoader = require('@grpc/proto-loader');

// const PROTO_PATH = __dirname + '/protos/mail.proto';

// // Load the proto files
// let packageDefinition = protoLoader.loadSync(
//     PROTO_PATH,
//     {keepCase: true,
//      longs: String,
//      enums: String,
//      defaults: true,
//      oneofs: true,
//      includeDirs: [ __dirname + '/protos' ]  
//     });
// let mailProto = grpc.loadPackageDefinition(packageDefinition).mail;

async function main() {
    // Initialize the tools
    // const bootstrap = new Bootstrap();
    // await bootstrap.init();

    let server = new grpc.Server();
    const handler = new Handler(grpc);
    server.addService(mailProto.MailServiceService, {
        sendMail: handler.sendMail,
    })
    
    let address = process.env.SERVICE_MAIL;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Server running at " + address);
    });
}

main();