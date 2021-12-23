const mailService = require("../protobuf/mail_grpc_pb");
const grpc = require('@grpc/grpc-js');

module.exports = class Service {
    constructor() {
        this.mailService = new mailService.MailServiceClient(process.env.SERVICE_MAIL, grpc.credentials.createInsecure());
    }
}