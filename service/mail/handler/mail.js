const empty = require("is-empty")
const fs = require("fs");
const handlebars = require('handlebars');
const path = require('path');
const messages = require('../protobuf/mail_pb');
const SMTPClient = require("../package/mail/smtp/smtp");
const MailjetClient = require("../package/mail/mailjet/mailjet");

module.exports = class API {
    constructor(grpc) {
        this.grpc = grpc;
    }

    getMailClient = async (client) => {
        switch(client) {
            case "MAILJET":
                return new MailjetClient();
            case "SMTP":
                return new SMTPClient();
            default:
                throw new Error("Invalid mail client")
        }
    }

    getMailContent = (filePath, values) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    reject(err);
                    return
                } 
                let template = handlebars.compile(html);
                resolve(template(values));
            });
        })
    }

    sendMail = async (payload, callback) => {
        const request = payload.request.toObject();
        this.getMailClient(request.mailclient).then(async (mailClient) => {
            try {
                let content = request.content;
                if(!empty(request.template)) {
                    const filePath = path.join(__dirname, '../resource/') + request.template + '.html'
                    let templateValues = {};
                    request.templatevaluesList?.map((ele) => {
                        Object.assign(templateValues, {
                            [ele.key]: ele.value
                        })
                    })

                    content = await this.getMailContent(filePath, templateValues);
                }
                
                const result = await mailClient.sendMail(request.recipientsList, request.subject, content);

                var reply = new messages.SendMailResponse();
                reply.setIssuccess(result);
                callback(null, reply);
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