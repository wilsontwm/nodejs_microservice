// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var mail_pb = require('./mail_pb.js');

function serialize_mail_SendMailRequest(arg) {
  if (!(arg instanceof mail_pb.SendMailRequest)) {
    throw new Error('Expected argument of type mail.SendMailRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mail_SendMailRequest(buffer_arg) {
  return mail_pb.SendMailRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mail_SendMailResponse(arg) {
  if (!(arg instanceof mail_pb.SendMailResponse)) {
    throw new Error('Expected argument of type mail.SendMailResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mail_SendMailResponse(buffer_arg) {
  return mail_pb.SendMailResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var MailServiceService = exports.MailServiceService = {
  sendMail: {
    path: '/mail.MailService/sendMail',
    requestStream: false,
    responseStream: false,
    requestType: mail_pb.SendMailRequest,
    responseType: mail_pb.SendMailResponse,
    requestSerialize: serialize_mail_SendMailRequest,
    requestDeserialize: deserialize_mail_SendMailRequest,
    responseSerialize: serialize_mail_SendMailResponse,
    responseDeserialize: deserialize_mail_SendMailResponse,
  },
};

exports.MailServiceClient = grpc.makeGenericClientConstructor(MailServiceService);
