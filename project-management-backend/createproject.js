'use strict';
require

let AWS = require('aws-sdk');
let uuid = require('uuid');
let documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  let body = JSON.parse(event.body);

  if(body.name.length > 0 && body.description.length > 0 && body.status == "New" || "In progress"  || "Completed" && 
body.assignees.length >0) {
  let project = {
    'id': uuid.v4(),
    'name': body.name,
    'description': body.description,
    'status': body.status,
    'assignees': body.assignees
  };
}

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
