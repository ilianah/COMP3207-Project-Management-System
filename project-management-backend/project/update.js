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
let listUsers = require("../users/list").handler;
let { sendEmail } = require("../util/sendEmail");

module.exports.handler = async event => {
  if (
    !(await hasRole(event, "Admin")) &&
    !(await hasRole(event, "ProjectManager"))
  )
    return permissionError();

  let body = JSON.parse(event.body);

  if (
    !(await hasRole(event, "Admin")) &&
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
      TableName: "projects",
      ReturnValues: "ALL_OLD"
    };
    let res = await documentClient.put(params).promise();

    let oldAssignees = res.Attributes.assignees;
    let users = JSON.parse((await listUsers()).body);

    let promises = users
      .map(u => ({ label: u.username, value: u.email }))
      .filter(
        u =>
          project.assignees.includes(u.label) && !oldAssignees.includes(u.label)
      )
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

    let promises1 = users
      .map(u => ({ label: u.username, value: u.email }))
      .filter(
        u =>
          !project.assignees.includes(u.label) && oldAssignees.includes(u.label)
      )
      .map(user =>
        sendEmail(
          user.value,
          "Hello, you've been removed from " +
            project.name +
            " (" +
            project.description +
            ")",
          "You've been removed from a project"
        )
      );
    await Promise.all(promises1);

    return respondWithHeaders(200, project);
  } catch (e) {
    console.log(e);
    return respondWithHeaders(500, e);
  }
};
