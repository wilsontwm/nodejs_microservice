const Service = require('./../services/index');

module.exports = class Middleware {
    constructor() {
        this.services = new Service();
    }
}