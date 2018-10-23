'use strict';
let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  let params = {
    TableName: 'projects',
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    let res = await documentClient.delete(params).promise();
    return {
      body: JSON.stringify(res),
      statusCode: 200
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 500
    }
  }
};
