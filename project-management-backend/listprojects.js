'use strict';
let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();
let respondWithHeaders = require('./util/helpers');

module.exports.handler = async (event, context) => {
  try {
    let params = {
      TableName: 'projects'
    };
    let res = await documentClient.scan(params).promise();
    return respondWithHeaders(200, res.Items);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
