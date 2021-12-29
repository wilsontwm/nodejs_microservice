// Middleware 
const Authentication = require('./../middleware/authentication');
// Controller
const UserController = require('./../controllers/users');

var middleware = null;
var controllers = null;

function initMiddleware () {
    return {
        authentication: new Authentication(),
    }
}

function initControllers () {
    return {
        userController: new UserController(),
    }
}

exports.getMiddlewares = () => {
    if(middleware) {
        return middleware
    }

    middleware = initMiddleware();
    return middleware;
}

exports.getControllers = () => {
    if(controllers) {
        return controllers
    }

    controllers = initControllers();
    return controllers;
}