const Controller = require('./index');
const Validator = require('validatorjs');
const userMessage = require('../protobuf/user_pb');

module.exports =  class UserController extends Controller {
    constructor() {
        super();
    }

    test = (req, callback) => {
        console.log("Req", req);
        console.log("callback", callback)
        throw new Error("Wrong")
    }

    user_register = async(req, res, next) => {
        try {
            let rules = {
                email: 'required|email',
                password: 'required|min:8',
                firstName: 'required',
                lastName: 'required'
            };
              
            let validation = new Validator(req.body, rules);
            
            if(!validation.passes()) {
                return res.status(412).json(validation.errors);
            }
            
            // Register user
            var registerUserRequest = new userMessage.RegisterUserRequest();
            registerUserRequest.setEmail(req.body.email);
            registerUserRequest.setFirstname(req.body.firstName);
            registerUserRequest.setLastname(req.body.lastName);
            registerUserRequest.setPassword(req.body.password);
            
            const response = await this.services.userService.registerUser(registerUserRequest);
            
            return res.status(200).json(response.toObject())
    
        } catch (e){
            return res.status(500).json({
                code: e.code,
                error: e.details,
                debug: e.message
            });
        }
    }
}
