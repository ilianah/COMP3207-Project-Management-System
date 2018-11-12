"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();

/*
 * Lambda invoked when creating a new user
 * The user is automatically added to the Developer group
 */
module.exports.handler = async event => {
  let res = await cognitoClient
    .adminAddUserToGroup({
      GroupName: "Developer",
      UserPoolId: event.userPoolId,
      Username: event.userName
    })
    .promise();
  return event;
};
