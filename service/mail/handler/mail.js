const MailjetClient = require("../package/mail/mailjet/mailjet");

module.exports = class API {
    constructor(grpc) {
        this.grpc = grpc;
    }

    getMailClient = async (client) => {
        switch(client) {
            case "MAILJET":
                return new MailjetClient();
            default:
                throw new Error("Invalid mail client")
        }
    }

    sendMail = async (payload, callback) => {
        this.getMailClient(payload.request.mailClient).then(async (mailClient) => {
            try {
                const result = await mailClient.sendMail(payload.request.recipients, payload.request.subject, payload.request.content);
                
                callback(null, {
                    isSuccess: result,
                })
            } catch (e) {
                callback({
                    code: this.grpc.status.FAILED_PRECONDITION,
                    message: e.message
                });
            }
            
        }).catch((e) => {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: e.message
            });
            return
        });
    }



}