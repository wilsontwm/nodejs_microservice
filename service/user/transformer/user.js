exports.toUser = (userModel) => {
    return {
        id: userModel.id.toString(),
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        email: userModel.email,
        activationCode: userModel.activationCode,
        createdDateTime: userModel.createdAt.toISOString(),
        updatedDateTime: userModel.updatedAt.toISOString()
 
    }
}