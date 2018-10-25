'use strict';
let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();
let { respondWithHeaders, hasRole, permissionError } = require('./util/helpers');

module.exports.handler = async event => {
  if (!hasRole(event, 'Admin') && !hasRole(event, 'ProjectManager'))
    return permissionError();
  try {
    let params = {
      TableName: 'projects',
      Key: {
        id: event.pathParameters.id
      },
      ConditionExpression: `#owner = :u`,
      ExpressionAttributeValues: { 
        ':u': event.requestContext.authorizer.claims['cognito:username'] 
      },
      ExpressionAttributeNames: {
        '#owner': 'owner'
      }
    };

    if(hasRole(event, 'Admin')) {
      delete params.ConditionExpression;
      delete params.ExpressionAttributeNames;
      delete params.ExpressionAttributeValues;
    }

    let res = await documentClient.delete(params).promise();
    return respondWithHeaders(200, res);

  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
