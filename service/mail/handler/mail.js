const MailjetClient = require("../package/mail/mailjet/mailjet");
const empty = require("is-empty")
const fs = require("fs");
const handlebars = require('handlebars');
const path = require('path');

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
        this.getMailClient(payload.request.mailClient).then(async (mailClient) => {
            try {
                let content = payload.request.content;
                if(!empty(payload.request.template)) {
                    const filePath = path.join(__dirname, '../resource/') + payload.request.template + '.html'
                    let templateValues = {};
                    payload.request.templateValues?.map((ele) => {
                        Object.assign(templateValues, {
                            [ele.key]: ele.value
                        })
                    })

                    content = await this.getMailContent(filePath, templateValues);
                }
                
                const result = await mailClient.sendMail(payload.request.recipients, payload.request.subject, content);
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