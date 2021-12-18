const md5 = require('md5');
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

    login = async(payload, callback) => {

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