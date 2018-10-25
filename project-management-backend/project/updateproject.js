'use strict';
require

let AWS = require('aws-sdk');
let uuid = require('uuid');
let documentClient = new AWS.DynamoDB.DocumentClient();
let { respondWithHeaders, permissionError, validationError, hasRole } = require('../util/helpers');

module.exports.handler = async event => {
  if (!hasRole(event, 'Admin') && !hasRole(event, 'ProjectManager'))
    return permissionError();

  let body = JSON.parse(event.body);

  if (!hasRole(event, 'Admin') && body.owner !== event.requestContext.authorizer.claims['cognito:username'])
    return validationError("The project you update must be yours");

  if (!body.name || body.name.length === 0 || body.name.length > 80)
    return validationError('Project name must be between 1 and 80 characters');

  if (!body.description || body.description.length == 0 || body.description.length > 250)
    return validationError('Project description must be between 1 and 250 characters');

  if (!body.status || (body.status != 'New' && body.status != 'In progress' && body.status != "Completed"))
    return validationError('Invalid project status');

  if (!body.owner || body.owner.length === 0)
    return validationError("Each project must have a project owner!");

  if (!body.assignees || !(Array.isArray(body.assignees)) || body.assignees.length < 1)
    return validationError("Invalid assignees");

  try {
    let project = {
      'id': body.id,
      'name': body.name,
      'description': body.description,
      'status': body.status,
      'owner': body.owner,
      'assignees': body.assignees
    };

    let params = {
      Item: project,
      TableName: 'projects'
    };
    let res = await documentClient.put(params).promise();
    return respondWithHeaders(200, project);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
