const MailClient = require("..");
const nodemailer = require('nodemailer');

module.exports = class SMTPClient extends MailClient {
    constructor() {
        super();
        this.host = "";
        this.port = "";
        this.fromName = "";
        this.fromEmail = "";
        this.username = "";
        this.password = "";
        this.client = null;
        this.init();
    }

    init = async () => {
        this.host = process.env.SMTP_HOST;
        this.port = process.env.SMTP_PORT;
        this.username = process.env.SMTP_USERNAME;
        this.password = process.env.SMTP_PASSWORD;
        this.fromName = process.env.MAIL_FROM_NAME;
        this.fromEmail = process.env.MAIL_FROM_EMAIL;

        let isSecure = this.port == "587" ? false : true
        this.client = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: isSecure, // true for 465, false for other ports
            auth: {
                user: this.username, // generated ethereal user
                pass: this.password // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    sendMail = async (recipients, subject, content) => {
        return new Promise((resolve, reject) => {
            let recs = new Array();
            recipients.map((e) => {
                recs.push(`"${ e.name }" ${ e.email }`)
            })
            
            if(recs.length == 0) {
                reject(new Error("Recipients cannot be empty"))
                return
            }
            
            let mailOptions = {
                from: `"${ this.fromName }" <${ this.fromEmail }>`, //'"Node Mailer" <l4spet4dpcnb6mh2@ethereal.email>', // sender address
                to: recs.join(","), // list of receivers separated by comma
                subject: subject, // Subject line
                html: content
            };

            this.client.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                    return
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                resolve(true);
            });
            
        })
    }
}