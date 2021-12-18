const mongodb = require("./mongodb");

module.exports = class Bootstrap {
    constructor() {
    }

    async init() {
        await mongodb.initMongodb();
    }
}