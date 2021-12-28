const mailService = require("../protobuf/mail_grpc_pb");
const userService = require("../protobuf/user_grpc_pb");
const grpc = require('@grpc/grpc-js');
const { promisify } = require('util');


module.exports = class Service {
    constructor() {
        this.userService = this.promisifyAll(new userService.UserServiceClient(process.env.SERVICE_USER, grpc.credentials.createInsecure()));
        this.mailService = this.promisifyAll(new mailService.MailServiceClient(process.env.SERVICE_MAIL, grpc.credentials.createInsecure()));
    }

    promisifyAll = (client) => {
        const to = {};
        for (var k in client) {
            if (typeof client[k] != 'function') continue;
            to[k] = promisify(client[k].bind(client));
        }
        return to;
    }
    
}