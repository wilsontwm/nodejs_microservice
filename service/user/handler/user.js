const md5 = require('md5');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomString } = require('../kit/random');
const userRepository = require('../repository/user');
const userTransformer = require("../transformer/user");

module.exports = class API {
    constructor(grpc) {
        this.grpc = grpc;
    }

    register = async (payload, callback) => {
        let user = await userRepository.getUserByEmail(payload.request.email)
        if(user) {
            callback({
                code: this.grpc.status.ALREADY_EXISTS,
                message: "Email has already been taken"
            });
            return
        }

        try {
            let result = await userRepository.createUser({
                firstName: payload.request.firstName,
                lastName: payload.request.lastName,
                email: payload.request.email,
                password: payload.request.password,
            })

            callback(null, {
                item: userTransformer.toUser(result)
            })
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
        
    }

    loginUser = async(payload, callback) => {
        // Get the user by email first
        let user = await userRepository.getUserByEmail(payload.request.email)
        if(!user) {
            callback({
                code: this.grpc.status.FAILED_PRECONDITION,
                message: "Email / password is invalid"
            });
            return
        }

        // Check password
        const match = await bcrypt.compare(payload.request.password, user.password);
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

        callback(null, {
            item: userTransformer.toUser(user),
            token
        })
    }

    resendActivationCode = async(payload, callback) => {
        let user = await userRepository.getUserByEmail(payload.request.email)
        if(!user) {
            callback({
                code: this.grpc.status.NOT_FOUND,
                message: "User is not registered"
            });
            return
        }

        try {
            user.activationCode = md5(user._id.toString() + randomString(10));
            user.updatedAt = Date.now();

            let result = await userRepository.updateUser(user)

            // TODO: Send activation code email

            callback(null, {
                item: userTransformer.toUser(result)
            })
        } catch (err){
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }
}