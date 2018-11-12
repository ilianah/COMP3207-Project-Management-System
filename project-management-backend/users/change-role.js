"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

// Lambda to change a user role
module.exports.handler = async event => {
  // Only Admins can change user roles
  if (!(await hasRole(event, "Admin"))) return permissionError();
  try {
    // Keep track of the old and the new role
    event.body = JSON.parse(event.body);
    let oldRole = event.body.oldRole;

    let newRole = event.body.newRole;

    // Remove the user from the old group
    let res = await cognitoClient
      .adminRemoveUserFromGroup({
        GroupName: oldRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();

    // Add the user to the new group
    let res2 = await cognitoClient
      .adminAddUserToGroup({
        GroupName: newRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();

    return respondWithHeaders(200, res);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
