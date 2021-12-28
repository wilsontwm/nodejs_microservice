const Service = require('./../services/index');

module.exports = class Controller {
    constructor() {
        this.services = new Service();
    }
}