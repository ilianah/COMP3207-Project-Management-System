'use strict';
require

let AWS = require('aws-sdk');
let uuid = require('uuid');
let documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  let body = JSON.parse(event.body);
  let project = {
    'id': body.id,
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
};