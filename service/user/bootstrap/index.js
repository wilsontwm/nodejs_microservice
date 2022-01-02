const mongodb = require("./mongodb");
const googleOAuth = require("./google_oauth");

module.exports = class Bootstrap {
    constructor() {
        this.googleOAuth = null;
    }

    async init() {
        await mongodb.initMongodb();
        this.googleOAuth = googleOAuth.initGoogleOauth();
    }
}