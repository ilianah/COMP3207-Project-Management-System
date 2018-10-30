"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

module.exports.handler = async event => {
  console.log(1);
  if (!hasRole(event, "Admin")) return permissionError();
  console.log(event.body);
  try {
    event.body = JSON.parse(event.body);
    let oldRole = event.body.oldRole;

    let newRole = event.body.newRole;
    console.log(oldRole);
    console.log(newRole);

    let res = await cognitoClient
      .adminRemoveUserFromGroup({
        GroupName: oldRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();
    let res2 = await cognitoClient
      .adminAddUserToGroup({
        GroupName: newRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();

    return respondWithHeaders(200, res);
  } catch (e) {
    console.log(e);
    return respondWithHeaders(500, e);
  }
};
