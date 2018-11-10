"use strict";
require;

let AWS = require("aws-sdk");
let uuid = require("uuid");
let documentClient = new AWS.DynamoDB.DocumentClient();
let {
  respondWithHeaders,
  hasRole,
  permissionError,
  validationCheck
} = require("../util/helpers");
let { sendEmail } = require("../util/sendEmail");
let listUsers = require("../users/list").handler;

module.exports.handler = async event => {
  let body = JSON.parse(event.body);

  if (
    !(await hasRole(event, "Admin")) &&
    !(await hasRole(event, "ProjectManager"))
  )
    return permissionError();

  if (
    !(await hasRole(event, "Admin")) &&
    body.owner !== event.requestContext.authorizer.claims["cognito:username"]
  )
    return validationError("The project you create must be yours");

  validationCheck(body);

  try {
    let project = {
      id: uuid.v4(),
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

    let users = JSON.parse((await listUsers()).body);

    let promises = users
      .map(u => ({ label: u.username, value: u.email }))
      .filter(u => project.assignees.includes(u.label))
      .map(user =>
        sendEmail(
          user.value,
          "Hello, you've been assigned to " +
            project.name +
            " (" +
            project.description +
            ")",
          project.owner + " assigned you to a new project!"
        )
      );

    await Promise.all(promises);

    return respondWithHeaders(200, project);
  } catch (e) {
    console.log(e);
    return respondWithHeaders(500, e);
  }
};
