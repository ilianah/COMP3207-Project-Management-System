'use strict';
require

let AWS = require('aws-sdk');
let uuid = require('uuid');
let documentClient = new AWS.DynamoDB.DocumentClient();
let { respondWithHeaders, hasRole, permissionError, validationCheck } = require('../util/helpers');

module.exports.handler = async event => {

  let body = JSON.parse(event.body);

  if (!hasRole(event, 'Admin') && !hasRole(event, 'ProjectManager'))
    return permissionError();

  if (!hasRole(event, 'Admin') && body.owner !== event.requestContext.authorizer.claims['cognito:username'])
    return validationError("The project you create must be yours");

  validationCheck(body);

  try {
    let project = {
      'id': uuid.v4(),
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
