"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let { respondWithHeaders } = require("../util/helpers");

module.exports.handler = async event => {
  try {
    let res = await cognitoClient
      .adminGetUser({
        Username: event.pathParameters.username,
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();
    let skillsAttr = res.UserAttributes.find(u => u.Name === "custom:skills");
    let skills = skillsAttr ? skillsAttr.Value : "";

    return respondWithHeaders(200, { skills });
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
