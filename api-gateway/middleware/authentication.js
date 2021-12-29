const Middleware = require('./index');
const userMessage = require('../protobuf/user_pb');

module.exports =  class Authentication extends Middleware {
    constructor() {
        super();
    }

    check_user_authentication = async(req, res, next) => {
        try {
            const token = req.headers.authorization;
            
            // Verify token
            var verifyTokenRequest = new userMessage.VerifyTokenRequest();
            verifyTokenRequest.setToken(token);
            
            const response = await this.services.userService.verifyToken(verifyTokenRequest);
            res.locals.user = response.toObject();
            next();
        } catch (e){
            return res.status(401).json({
                code: e.code,
                error: "Authentication failed",
                debug: e.message
            });
        }
    }
}