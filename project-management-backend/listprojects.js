'use strict';
let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();
let { respondWithHeaders, hasRole, permissionError } = require('./util/helpers');

module.exports.handler = async event => {
  if (hasRole(event, 'Admin') || hasRole(event, 'Developer') || hasRole(event, 'ProjectManager')) {
    try {
      let params = {
        TableName: 'projects'
      };
      let res = await documentClient.scan(params).promise();
      console.log(JSON.stringify(event))
      return respondWithHeaders(200, res.Items);
    } catch (e) {
      return respondWithHeaders(500, e);
    }
  }

  return permissionError();
};
