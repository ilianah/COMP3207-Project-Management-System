"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let { respondWithHeaders } = require("../util/helpers");

module.exports.handler = async event => {
  try {
    let res = await cognitoClient
      .listUsers({
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();

    let users = res.Users.map(u => ({
      username: u.Username,
      name: u.Attributes.find(n => n.Name === "name").Value,
      lastModified: u.UserLastModifiedDate,
      email: u.Attributes.find(a => a.Name === "email").Value,
      birthdate: u.Attributes.find(b => b.Name === "birthdate").Value,
      picture: u.Attributes.find(p => p.Name === "picture").Value
    }));
    return respondWithHeaders(200, users);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
