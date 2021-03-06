const md5 = require('md5');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomString } = require('../kit/random');
const messages = require('../protobuf/user_pb');
const mailMessages = require('../protobuf/mail_pb');
const userRepository = require('../repository/user');
const userTransformer = require("../transformer/user");
const { google } = require("googleapis");
const queryString = require("query-string");
const axios = require("axios");

module.exports = class API {
    constructor(grpc, bootstrap, services) {
        this.grpc = grpc;
        this.bootstrap = bootstrap;
        this.services = services;
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
                isRequireActivation: true
            })

            // Send email to user
            var mailRequest = new mailMessages.SendMailRequest();
            var mailRecipients = Array();
            var mailRecipient = new mailMessages.SendMailRecipient();
            mailRecipient.setEmail(request.email);
            mailRecipient.setName(request.firstname + " " + request.lastname);
            mailRecipients.push(mailRecipient);

            var templateValues = Array();
            var templateValue = new mailMessages.SendMailTemplateValue();
            templateValue.setKey("activationCode");
            templateValue.setValue(result.activationCode);
            templateValues.push(templateValue);

            mailRequest.setMailclient(process.env.SERVICE_MAIL_CLIENT);
            mailRequest.setRecipientsList(mailRecipients);
            mailRequest.setSubject("Activate Your Account");
            mailRequest.setTemplate("register");
            mailRequest.setTemplatevaluesList(templateValues);
            
            this.services.mailService.sendMail(mailRequest, function(err, response) {
                console.log('Send mail:', response);
                console.log('Err: ', err)
            });

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

            // Send email to user
            var mailRequest = new mailMessages.SendMailRequest();
            var mailRecipients = Array();
            var mailRecipient = new mailMessages.SendMailRecipient();
            mailRecipient.setEmail(user.email);
            mailRecipient.setName(user.firstname + " " + user.lastname);
            mailRecipients.push(mailRecipient);

            var templateValues = Array();
            var templateValue = new mailMessages.SendMailTemplateValue();
            templateValue.setKey("activationCode");
            templateValue.setValue(user.activationCode);
            templateValues.push(templateValue);

            mailRequest.setMailclient(process.env.SERVICE_MAIL_CLIENT);
            mailRequest.setRecipientsList(mailRecipients);
            mailRequest.setSubject("Activate Your Account");
            mailRequest.setTemplate("register");
            mailRequest.setTemplatevaluesList(templateValues);
            
            this.services.mailService.sendMail(mailRequest, function(err, response) {
                console.log('Send mail:', response);
                console.log('Err: ', err)
            });

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

            // Send email to user
            var mailRequest = new mailMessages.SendMailRequest();
            var mailRecipients = Array();
            var mailRecipient = new mailMessages.SendMailRecipient();
            mailRecipient.setEmail(user.email);
            mailRecipient.setName(user.firstname + " " + user.lastname);
            mailRecipients.push(mailRecipient);

            var templateValues = Array();
            var templateValue = new mailMessages.SendMailTemplateValue();
            templateValue.setKey("resetToken");
            templateValue.setValue(result.resetPasswordToken);
            templateValues.push(templateValue);

            mailRequest.setMailclient(process.env.SERVICE_MAIL_CLIENT);
            mailRequest.setRecipientsList(mailRecipients);
            mailRequest.setSubject("Reset Your Password");
            mailRequest.setTemplate("reset_password");
            mailRequest.setTemplatevaluesList(templateValues);

            this.services.mailService.sendMail(mailRequest, function(err, response) {
                console.log('Send mail:', response);
                console.log('Err: ', err)
            });

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

    googleOAuth = async(payload, callback) => {
        const request = payload.request.toObject();

        const defaultScope = [
            // 'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];
        
        try {
            const url = this.bootstrap.googleOAuth.generateAuthUrl({
                access_type: 'offline',
                prompt: 'consent',
                scope: defaultScope
            });

            var response = new messages.GoogleOAuthResponse();
            response.setItem(url);
            callback(null, response)
        } catch (err) {
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    googleOAuthCallback = async(payload, callback) => {
        const request = payload.request.toObject();

        try {
            const googleOAuthClient = this.bootstrap.googleOAuth;
            const dataResp = await googleOAuthClient.getToken(request.token);
            const tokens = dataResp.tokens;

            googleOAuthClient.setCredentials(tokens);
            const oauth2 = google.oauth2({ version: 'v2', auth: googleOAuthClient });
            const { data } = await oauth2.userinfo.get(); 

            const user = await userRepository.upsertUserFromProvider({
                firstName: data.given_name,
                lastName: data.family_name,
                email: data.email
            });

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

            var response = new messages.GoogleOAuthCallbackResponse();
            response.setItem(userTransformer.toUser(user));
            response.setToken(token);
            callback(null, response)
        } catch (err) {
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    facebookOAuth = async(payload, callback) => {
        const request = payload.request.toObject();

        try {
            const stringifiedParams = queryString.stringify({
                client_id: process.env.FACEBOOK_CLIENT_ID,
                redirect_uri: process.env.FACEBOOK_OAUTH_REDIRECT,
                scope: ['email', 'public_profile'].join(','), // comma seperated string
                response_type: 'code',
                auth_type: 'rerequest',
                display: 'popup',
            });

            const facebookLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?${stringifiedParams}`;
            var response = new messages.FacebookOAuthResponse();
            response.setItem(facebookLoginUrl);
            callback(null, response)
        } catch (err) {
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }

    facebookOAuthCallback = async(payload, callback) => {
        const request = payload.request.toObject();

        try {
            const { data } = await axios({
                url: 'https://graph.facebook.com/v12.0/oauth/access_token',
                method: 'get',
                params: {
                  client_id: process.env.FACEBOOK_CLIENT_ID,
                  client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                  redirect_uri: process.env.FACEBOOK_OAUTH_REDIRECT,
                  code: request.token,
                },
            });

            const resp = await axios({
                url: 'https://graph.facebook.com/me',
                method: 'get',
                params: {
                  fields: ['id', 'email', 'first_name', 'last_name'].join(','),
                  access_token: data.access_token,
                },
            });
              
            const user = await userRepository.upsertUserFromProvider({
                firstName: resp.data.first_name,
                lastName: resp.data.last_name,
                email: resp.data.email
            });

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

            var response = new messages.FacebookOAuthCallbackResponse();
            response.setItem(userTransformer.toUser(user));
            response.setToken(token);
            callback(null, response)
        } catch (err) {
            callback({
                code: this.grpc.status.INTERNAL,
                message: err.message
            })
        }
    }
}