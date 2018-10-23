'use strict';
require

let AWS = require('aws-sdk');
let uuid = require('uuid');
let documentClient = new AWS.DynamoDB.DocumentClient();

let validationError = message => ({statusCode: 500, body: JSON.stringify({message})});

module.exports.handler = async (event, context) => {
  let body = JSON.parse(event.body);

  if(!body.name || body.name.length === 0 || body.name.length > 80)
    return validationError('Project name must be between 1 and 80 characters');

  if(!body.description || body.description.length == 0 || body.description.length > 250)
    return validationError('Project description must be between 1 and 250 characters');

  if(!body.status || (body.status != 'New' && body.status != 'In progress' && body.status != "Completed"))
    return validationError('Invalid project status');

  if(!body.assignees || !(Array.isArray(body.assignees)) || body.assignees.length < 1)
    return validationError("Invalid assignees");

  let project = {
    'id': body.uuid,
    'name': body.name,
    'description': body.description,
    'status': body.status,
    'assignees': body.assignees
  };

let params = {
  Item: project,
  TableName: 'projects'
};

try {
  let res = await documentClient.put(params).promise();
  return {
    body: JSON.stringify(project),
    statusCode: 200
  };
} catch (e) {
  return {
    body: JSON.stringify(e),
    statusCode: 500
  }
}
  

  return {
    body: JSON.stringify({message: 'Validation error.'}),
    statusCode: 500
  }
};
