"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let { respondWithHeaders } = require("../util/helpers");

module.exports.handler = async event => {

    let res = await cognitoClient
      .adminAddUserToGroup({
        GroupName: "Developer",
        UserPoolId: event.userPoolId,
        Username: event.userName
      })
      .promise();
    console.log(res)
    return event;
}