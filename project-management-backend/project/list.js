"use strict";
let AWS = require("aws-sdk");
let documentClient = new AWS.DynamoDB.DocumentClient();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

// Lambda to list all projects from DynamoDB
module.exports.handler = async event => {
  // All users have access to the projects
  if (
    (await hasRole(event, "Admin")) ||
    (await hasRole(event, "Developer")) ||
    (await hasRole(event, "ProjectManager"))
  ) {
    try {
      let params = {
        TableName: "projects"
      };
      let res = await documentClient.scan(params).promise();
      return respondWithHeaders(200, res.Items);
    } catch (e) {
      return respondWithHeaders(500, e);
    }
  }

  return permissionError();
};
