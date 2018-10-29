"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

module.exports.handler = async event => {
  try {
    let res = await cognitoClient
      .listUsers({
        UserPoolId: "us-east-1_p0HFIGDim"
      })
      .promise();

    let users = res.Users.map(u => ({
      username: u.Username
    }));
    return respondWithHeaders(200, users);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
