const md5 = require('md5');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomString } = require('../kit/random');
const messages = require('../protobuf/user_pb');
const userRepository = require('../repository/user');
const userTransformer = require("../transformer/user");

module.exports = class API {
    constructor(grpc) {
        this.grpc = grpc;
    }

    register = async (payload, callback) => {
        const request = payload.request.toObject();
        let user = await userRepository.getUserByEmail(request.email)
        if(user) {
            callback({
                code: this.grpc.status.ALREADY_EXISTS,
                message: "Email has already been taken"
            });
            return
        }

        try {
            let result = await userRepository.createUser({
                firstName: request.firstname,
                lastName: request.lastname,
                email: request.email,
                password: request.password,
            })

            var response = new messages.RegisterUserResponse();
            response.setItem(userTransformer.toUser(result));

            callback(null, response)
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
        
    }

    loginUser = async(payload, callback) => {
        const request = payload.request.toObject();
        // Get the user by email first
        let user = await userRepository.getUserByEmail(request.email)
        if(!user) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "Email / password is invalid"
            });
            return
        }

        // Check password
        const match = await bcrypt.compare(request.password, user.password);
        if(!match) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "Email / password is invalid"
            });
            return
        } else if(!user.isActivated) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "User is not activated"
            });
            return
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            }, 
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        );

        var response = new messages.LoginUserResponse();
        response.setItem(userTransformer.toUser(user));
        response.setToken(token);

        callback(null, response)
    }

    resendActivationCode = async(payload, callback) => {
        const request = payload.request.toObject();
        let user = await userRepository.getUserByEmail(request.email)
        if(!user) {
            callback({
                code: this.grpc.status.NOT_FOUND,
                message: "User is not registered"
            });
            return
        } else if(user.isActivated) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "User is activated"
            })
            return
        }

        try {
            user.activationCode = md5(user._id.toString() + randomString(10));
            user.updatedAt = Date.now();

            let result = await userRepository.updateUser(user)

            // TODO: Send activation code email

            var response = new messages.ResendActivationCodeResponse();
            response.setItem(userTransformer.toUser(result));
            callback(null, response)
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    activateUser = async(payload, callback) => {
        const request = payload.request.toObject();
        let user = await userRepository.getUserByActivationCode(request.code)
        if(!user) {
            callback({
                code: this.grpc.status.NOT_FOUND,
                message: "User is not found"
            });
            return
        }

        try {
            user.activationCode = null;
            user.updatedAt = Date.now();

            let result = await userRepository.updateUser(user)

            var response = new messages.ActivateUserResponse();
            response.setItem(userTransformer.toUser(result));
            callback(null, response)
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    forgetPassword = async(payload, callback) => {
        const request = payload.request.toObject();
        let user = await userRepository.getUserByEmail(request.email)
        if(!user) {
            callback({
                code: this.grpc.status.NOT_FOUND,
                message: "User is not registered"
            });
            return
        } else if(!user.isActivated) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "User is not activated"
            })
            return
        }

        try {
            // Generate token
            const buf = crypto.randomBytes(20);
            const token = buf.toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            user.updatedAt = Date.now();

            let result = await userRepository.updateUser(user)

            // TODO: Send reset password email

            var response = new messages.ForgetPasswordResponse();
            response.setItem(userTransformer.toUser(result));
            response.setToken(token);
            callback(null, response)
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    resetPassword = async(payload, callback) => {
        const request = payload.request.toObject();
        let user = await userRepository.getUserByResetPasswordToken(request.code)
        if(!user) {
            callback({
                code: this.grpc.status.NOT_FOUND,
                message: "Reset password link is invalid or has expired"
            });
            return
        }

        try {

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(request.password, salt);
    
            user.password = passwordHash;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null
            user.updatedAt = Date.now();

            let result = await userRepository.updateUser(user)
            var response = new messages.ResetPasswordResponse();
            response.setItem(userTransformer.toUser(result));
            callback(null, response)
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    verifyToken = async(payload, callback) => {
        const request = payload.request.toObject();
        jwt.verify(request.token, process.env.JWT_KEY, async(err, decoded) => {
            if(err) {
                callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "Unauthenticated access"
                });
                return
            }

            let user = await userRepository.getUserByID(decoded.id)
            if(!user) {
                callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "Unauthenticated access"
                });
                return
            }

            
            var response = new messages.VerifyTokenResponse();
            response.setItem(userTransformer.toUser(user));
            callback(null, response)
        });
        
    }
}