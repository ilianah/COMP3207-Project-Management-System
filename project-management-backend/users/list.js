"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let { respondWithHeaders } = require("../util/helpers");

/*
 * Lambda to list all users in groups;
 * The function is called several times to return all users in the
 * three existing cognito groups
 * This makes role management easier and the users don't have to be pulled twice
 * to get their roles
 */
module.exports.handler = async event => {
  try {
    let res1 = await cognitoClient
      .listUsersInGroup({
        GroupName: "Developer",
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();
    let res2 = await cognitoClient
      .listUsersInGroup({
        GroupName: "Admin",
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();

    let res3 = await cognitoClient
      .listUsersInGroup({
        GroupName: "ProjectManager",
        UserPoolId: "us-east-1_p4KcysLln"
      })
      .promise();

    res1.Users = res1.Users.map(u => {
      u.group = "Developer";
      return u;
    });
    res2.Users = res2.Users.map(u => {
      u.group = "Admin";
      return u;
    });
    res3.Users = res3.Users.map(u => {
      u.group = "ProjectManager";
      return u;
    });

    let res = [...res1.Users, ...res2.Users, ...res3.Users];

    let users = res.map(u => ({
      username: u.Username,
      name: u.Attributes.find(n => n.Name === "name").Value,
      lastModified: u.UserLastModifiedDate,
      email: u.Attributes.find(a => a.Name === "email").Value,
      birthdate: u.Attributes.find(b => b.Name === "birthdate").Value,
      picture: u.Attributes.find(p => p.Name === "picture").Value,
      skills: (u.Attributes.find(p => p.Name === "custom:skills") || {}).Value,
      group: u.group
    }));
    return respondWithHeaders(200, users);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
