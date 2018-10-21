'use strict';
let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  let params = {
    TableName: 'projects'
  };

  try {
    let res = await documentClient.scan(params).promise();
    return {
      body: JSON.stringify(res.Items),
      statusCode: 200
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 500
    }
  }
};
