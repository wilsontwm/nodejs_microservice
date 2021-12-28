const UserController = require('./../controllers/users');

var controllers = null;

function initControllers () {
    return {
        userController: new UserController(),
    }
}

exports.getControllers = () => {
    if(controllers) {
        return controllers
    }

    controllers = initControllers();
    return controllers;
}