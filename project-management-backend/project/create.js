"use strict";

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

// Lambda for creating a project
module.exports.handler = async event => {
  let body = JSON.parse(event.body);

  // Only Admins and Project Managers can create a project
  if (
    !(await hasRole(event, "Admin")) &&
    !(await hasRole(event, "ProjectManager"))
  )
    return permissionError();

  // The project being created must belong to the creator
  if (
    !(await hasRole(event, "Admin")) &&
    body.owner !== event.requestContext.authorizer.claims["cognito:username"]
  )
    return validationError("The project you create must be yours");

  // Validate the project fields
  validationCheck(body);

  // Generate the project fields
  try {
    let project = {
      // generate random project id
      id: uuid.v4(),
      name: body.name,
      description: body.description,
      status: body.status,
      owner: body.owner,
      assignees: body.assignees
    };

    // Put the item in the specified DynamoDB table
    let params = {
      Item: project,
      TableName: "projects"
    };

    let res = await documentClient.put(params).promise();

    let users = JSON.parse((await listUsers()).body);

    // Send emails to assignees
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
