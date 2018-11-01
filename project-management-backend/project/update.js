"use strict";
require;

let AWS = require("aws-sdk");
let documentClient = new AWS.DynamoDB.DocumentClient();
let {
  respondWithHeaders,
  permissionError,
  validationError,
  validationCheck,
  hasRole
} = require("../util/helpers");

module.exports.handler = async event => {
  if (!await hasRole(event, "Admin") && !await hasRole(event, "ProjectManager"))
    return permissionError();

  let body = JSON.parse(event.body);

  if (
    !await hasRole(event, "Admin") &&
    body.owner !== event.requestContext.authorizer.claims["cognito:username"]
  )
    return validationError("The project you update must be yours");

  validationCheck(body);

  try {
    let project = {
      id: body.id,
      name: body.name,
      description: body.description,
      status: body.status,
      owner: body.owner,
      assignees: body.assignees
    };

    let params = {
      Item: project,
      TableName: "projects"
    };
    let res = await documentClient.put(params).promise();
    return respondWithHeaders(200, project);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
