// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');
var model_user_pb = require('./model/user_pb.js');

function serialize_user_ActivateUserRequest(arg) {
  if (!(arg instanceof user_pb.ActivateUserRequest)) {
    throw new Error('Expected argument of type user.ActivateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ActivateUserRequest(buffer_arg) {
  return user_pb.ActivateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ActivateUserResponse(arg) {
  if (!(arg instanceof user_pb.ActivateUserResponse)) {
    throw new Error('Expected argument of type user.ActivateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ActivateUserResponse(buffer_arg) {
  return user_pb.ActivateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ForgetPasswordRequest(arg) {
  if (!(arg instanceof user_pb.ForgetPasswordRequest)) {
    throw new Error('Expected argument of type user.ForgetPasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ForgetPasswordRequest(buffer_arg) {
  return user_pb.ForgetPasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ForgetPasswordResponse(arg) {
  if (!(arg instanceof user_pb.ForgetPasswordResponse)) {
    throw new Error('Expected argument of type user.ForgetPasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ForgetPasswordResponse(buffer_arg) {
  return user_pb.ForgetPasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GoogleOAuthCallbackRequest(arg) {
  if (!(arg instanceof user_pb.GoogleOAuthCallbackRequest)) {
    throw new Error('Expected argument of type user.GoogleOAuthCallbackRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GoogleOAuthCallbackRequest(buffer_arg) {
  return user_pb.GoogleOAuthCallbackRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GoogleOAuthCallbackResponse(arg) {
  if (!(arg instanceof user_pb.GoogleOAuthCallbackResponse)) {
    throw new Error('Expected argument of type user.GoogleOAuthCallbackResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GoogleOAuthCallbackResponse(buffer_arg) {
  return user_pb.GoogleOAuthCallbackResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GoogleOAuthRequest(arg) {
  if (!(arg instanceof user_pb.GoogleOAuthRequest)) {
    throw new Error('Expected argument of type user.GoogleOAuthRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GoogleOAuthRequest(buffer_arg) {
  return user_pb.GoogleOAuthRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GoogleOAuthResponse(arg) {
  if (!(arg instanceof user_pb.GoogleOAuthResponse)) {
    throw new Error('Expected argument of type user.GoogleOAuthResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GoogleOAuthResponse(buffer_arg) {
  return user_pb.GoogleOAuthResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_LoginUserRequest(arg) {
  if (!(arg instanceof user_pb.LoginUserRequest)) {
    throw new Error('Expected argument of type user.LoginUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_LoginUserRequest(buffer_arg) {
  return user_pb.LoginUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_LoginUserResponse(arg) {
  if (!(arg instanceof user_pb.LoginUserResponse)) {
    throw new Error('Expected argument of type user.LoginUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_LoginUserResponse(buffer_arg) {
  return user_pb.LoginUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_RegisterUserRequest(arg) {
  if (!(arg instanceof user_pb.RegisterUserRequest)) {
    throw new Error('Expected argument of type user.RegisterUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_RegisterUserRequest(buffer_arg) {
  return user_pb.RegisterUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_RegisterUserResponse(arg) {
  if (!(arg instanceof user_pb.RegisterUserResponse)) {
    throw new Error('Expected argument of type user.RegisterUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_RegisterUserResponse(buffer_arg) {
  return user_pb.RegisterUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ResendActivationCodeRequest(arg) {
  if (!(arg instanceof user_pb.ResendActivationCodeRequest)) {
    throw new Error('Expected argument of type user.ResendActivationCodeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ResendActivationCodeRequest(buffer_arg) {
  return user_pb.ResendActivationCodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ResendActivationCodeResponse(arg) {
  if (!(arg instanceof user_pb.ResendActivationCodeResponse)) {
    throw new Error('Expected argument of type user.ResendActivationCodeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ResendActivationCodeResponse(buffer_arg) {
  return user_pb.ResendActivationCodeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ResetPasswordRequest(arg) {
  if (!(arg instanceof user_pb.ResetPasswordRequest)) {
    throw new Error('Expected argument of type user.ResetPasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ResetPasswordRequest(buffer_arg) {
  return user_pb.ResetPasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_ResetPasswordResponse(arg) {
  if (!(arg instanceof user_pb.ResetPasswordResponse)) {
    throw new Error('Expected argument of type user.ResetPasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_ResetPasswordResponse(buffer_arg) {
  return user_pb.ResetPasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_VerifyTokenRequest(arg) {
  if (!(arg instanceof user_pb.VerifyTokenRequest)) {
    throw new Error('Expected argument of type user.VerifyTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_VerifyTokenRequest(buffer_arg) {
  return user_pb.VerifyTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_VerifyTokenResponse(arg) {
  if (!(arg instanceof user_pb.VerifyTokenResponse)) {
    throw new Error('Expected argument of type user.VerifyTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_VerifyTokenResponse(buffer_arg) {
  return user_pb.VerifyTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  registerUser: {
    path: '/user.UserService/registerUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.RegisterUserRequest,
    responseType: user_pb.RegisterUserResponse,
    requestSerialize: serialize_user_RegisterUserRequest,
    requestDeserialize: deserialize_user_RegisterUserRequest,
    responseSerialize: serialize_user_RegisterUserResponse,
    responseDeserialize: deserialize_user_RegisterUserResponse,
  },
  loginUser: {
    path: '/user.UserService/loginUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.LoginUserRequest,
    responseType: user_pb.LoginUserResponse,
    requestSerialize: serialize_user_LoginUserRequest,
    requestDeserialize: deserialize_user_LoginUserRequest,
    responseSerialize: serialize_user_LoginUserResponse,
    responseDeserialize: deserialize_user_LoginUserResponse,
  },
  resendActivationCode: {
    path: '/user.UserService/resendActivationCode',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.ResendActivationCodeRequest,
    responseType: user_pb.ResendActivationCodeResponse,
    requestSerialize: serialize_user_ResendActivationCodeRequest,
    requestDeserialize: deserialize_user_ResendActivationCodeRequest,
    responseSerialize: serialize_user_ResendActivationCodeResponse,
    responseDeserialize: deserialize_user_ResendActivationCodeResponse,
  },
  activateUser: {
    path: '/user.UserService/activateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.ActivateUserRequest,
    responseType: user_pb.ActivateUserResponse,
    requestSerialize: serialize_user_ActivateUserRequest,
    requestDeserialize: deserialize_user_ActivateUserRequest,
    responseSerialize: serialize_user_ActivateUserResponse,
    responseDeserialize: deserialize_user_ActivateUserResponse,
  },
  forgetPassword: {
    path: '/user.UserService/forgetPassword',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.ForgetPasswordRequest,
    responseType: user_pb.ForgetPasswordResponse,
    requestSerialize: serialize_user_ForgetPasswordRequest,
    requestDeserialize: deserialize_user_ForgetPasswordRequest,
    responseSerialize: serialize_user_ForgetPasswordResponse,
    responseDeserialize: deserialize_user_ForgetPasswordResponse,
  },
  resetPassword: {
    path: '/user.UserService/resetPassword',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.ResetPasswordRequest,
    responseType: user_pb.ResetPasswordResponse,
    requestSerialize: serialize_user_ResetPasswordRequest,
    requestDeserialize: deserialize_user_ResetPasswordRequest,
    responseSerialize: serialize_user_ResetPasswordResponse,
    responseDeserialize: deserialize_user_ResetPasswordResponse,
  },
  verifyToken: {
    path: '/user.UserService/verifyToken',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.VerifyTokenRequest,
    responseType: user_pb.VerifyTokenResponse,
    requestSerialize: serialize_user_VerifyTokenRequest,
    requestDeserialize: deserialize_user_VerifyTokenRequest,
    responseSerialize: serialize_user_VerifyTokenResponse,
    responseDeserialize: deserialize_user_VerifyTokenResponse,
  },
  googleOAuth: {
    path: '/user.UserService/googleOAuth',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GoogleOAuthRequest,
    responseType: user_pb.GoogleOAuthResponse,
    requestSerialize: serialize_user_GoogleOAuthRequest,
    requestDeserialize: deserialize_user_GoogleOAuthRequest,
    responseSerialize: serialize_user_GoogleOAuthResponse,
    responseDeserialize: deserialize_user_GoogleOAuthResponse,
  },
  googleOAuthCallback: {
    path: '/user.UserService/googleOAuthCallback',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GoogleOAuthCallbackRequest,
    responseType: user_pb.GoogleOAuthCallbackResponse,
    requestSerialize: serialize_user_GoogleOAuthCallbackRequest,
    requestDeserialize: deserialize_user_GoogleOAuthCallbackRequest,
    responseSerialize: serialize_user_GoogleOAuthCallbackResponse,
    responseDeserialize: deserialize_user_GoogleOAuthCallbackResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService);
