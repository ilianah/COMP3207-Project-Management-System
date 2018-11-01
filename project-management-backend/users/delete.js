"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

module.exports.handler = async event => {
  if (!await hasRole(event, "Admin")) return permissionError();
  try {
    let res = await cognitoClient

      .adminDeleteUser({
        Username: event.pathParameters.username,
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();
    return respondWithHeaders(200, { key: "Halloooo" });
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
