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
    event.body = JSON.parse(event.body);
    let skills = event.body.skills;
    let birthdate = event.body.birthdate;
    let res = await cognitoClient
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: "custom:skills",
            Value: skills
          },
          {
            Name: "birthdate",
            Value: birthdate
          }
        ],
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();
    return respondWithHeaders(200, res);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
