
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const User = require('../model/user');
const hex = require('../kit/hex');
const random = require("../kit/random");

exports.getUsers = ({id, name, email, limit, cursor}) => {
    return new Promise((resolve, reject) => {
        let query = {};
        if(id) {
            query._id = mongoose.Types.ObjectId(id);
        }
        if(name) {
            query.name = {
                $regex: '.*' + name + '.*',
                $options: 'i'
            }
        }
        if(email) {
            query.email = {
                $regex: '.*' + email + '.*',
                $options: 'i'
            }
        }

        lim = 10
        if(!!limit && limit > 0) {
            lim = parseInt(limit)
        }

        let skip = 0;
        if(cursor) {
            skip = Number(hex.hexToUtf8(cursor));
        }

        User.find(query, {password: 0}, { skip: skip, limit: lim + 1 }).exec()
        .then(result => {
            if(result.length > lim) {
                result = result.slice(0, lim)
                resolve({items: result, count: result.length, cursor: hex.utf8ToHex(String(skip+lim))}); 
            } else {
                resolve({items: result, count: result.length, cursor: ''}); 
            }    
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserByID = (id) => {
    return new Promise((resolve, reject) => {
        User.findOne({_id: mongoose.Types.ObjectId(id)}).exec()
        .then(result => {
            resolve(result);            
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserByEmail = async(email) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}).exec()
        .then(result => {
            resolve(result);            
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserByActivationCode = async(code) => {
    return new Promise((resolve, reject) => {
        User.findOne({activationCode: code}).exec()
        .then(result => {
            resolve(result);            
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserByResetPasswordToken = async(token) => {
    return new Promise((resolve, reject) => {
        User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}).exec()
        .then(result => {
            resolve(result);            
        }).catch(err => {
            reject(err);
        });
    });
}

exports.createUser = ({firstName, lastName, email, password, isRequireActivation}) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                reject(err)
                return
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    reject(err)
                    return
                } 
                const id = new mongoose.Types.ObjectId();
                let activationCode = "";
                if(isRequireActivation) {
                    activationCode = md5(id.toString() + random.randomString(10));
                }
                // Generate a random activation code
                const user = new User({
                    _id:  id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hash,
                    activationCode: activationCode,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
    
                user.save()
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
    
            });
        })
    });
}

exports.upsertUserFromProvider = ({email, firstName, lastName}) => {
    return new Promise(async(resolve, reject) => {
        let user = await this.getUserByEmail(email)

        if (user) {
            return resolve(user);
        }

        user = await this.createUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: random.randomString(10),
            isRequireActivation: false
        })

        return resolve(user)
    })
}

exports.updateUser = (user) => {
    return new Promise((resolve, reject) => {
        user.save()
        .then(result => {
            return resolve(result);
        })
        .catch(err => {
            return reject(err);
        });
    });
}
