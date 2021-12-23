const messages = require('../protobuf/model/user_pb');

exports.toUser = (userModel) => {
    var user = new messages.User();
    user.setId(userModel.id.toString());
    user.setFirstname(userModel.firstName);
    user.setLastname(userModel.lastName);
    user.setEmail(userModel.email);
    user.setCountrycode(userModel.countryCode);
    user.setPhonenumber(userModel.phoneNumber);
    user.setPhotourl(userModel.PhotoURL);
    user.setActivationcode(userModel.activationCode);
    user.setCreateddatetime(userModel.createdAt.toISOString());
    user.setUpdateddatetime(userModel.updatedAt.toISOString());
    return user;
}