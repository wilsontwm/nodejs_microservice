const MailClient = require("..");
const mailjet = require ('node-mailjet');

module.exports = class MailjetClient extends MailClient {
    constructor() {
        super();
        this.apiKey = "";
        this.apiSecret = "";
        this.fromName = "";
        this.fromEmail = "";
        this.client = null;
        this.init();
    }

    init = async () => {
        this.apiKey = process.env.MAIL_JET_KEY;
        this.apiSecret = process.env.MAIL_JET_SECRET;
        this.fromName = process.env.MAIL_FROM_NAME;
        this.fromEmail = process.env.MAIL_FROM_EMAIL;

        this.client = mailjet.connect(this.apiKey, this.apiSecret);
    }

    sendMail = async (recipients, subject, content) => {
        return new Promise((resolve, reject) => {
            let recs = new Array();
            recipients.map((e) => {
                recs.push({
                    "Email": e.email,
                    "Name": e.name,
                })
            })

            if(recs.length == 0) {
                reject(new Error("Recipients cannot be empty"))
                return
            } 

            this.client.post("send", {'version': 'v3.1'})
            .request({
                "Messages":[{
                    "From": {
                        "Email": this.fromEmail,
                        "Name": this.fromName,
                    },
                    "To": recs,
                    "Subject": subject,
                    "HTMLPart": content
                }]
            }).then((result) => {
                resolve(true)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}