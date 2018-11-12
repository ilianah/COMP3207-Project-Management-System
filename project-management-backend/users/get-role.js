"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

// Lambda to get a user's role
module.exports.handler = async event => {
  if (!(await hasRole(event, "Admin"))) return permissionError();
  try {
    let res = await cognitoClient
      //List all groups for a user in a specific userpool
      .adminListGroupsForUser({
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();
    return respondWithHeaders(200, res.Groups.map(g => g.GroupName));
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
