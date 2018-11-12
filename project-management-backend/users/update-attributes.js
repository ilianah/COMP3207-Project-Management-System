"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let { respondWithHeaders } = require("../util/helpers");

// Lambda to update user attributes
module.exports.handler = async event => {
  try {
    event.body = JSON.parse(event.body);
    let skills = event.body.skills;
    let picture = event.body.picture;
    let res = await cognitoClient
      // My implementation only requires updating skills and pictures, however this can be expanded in further development
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: "custom:skills",
            Value: skills
          },
          {
            Name: "picture",
            Value: picture
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
