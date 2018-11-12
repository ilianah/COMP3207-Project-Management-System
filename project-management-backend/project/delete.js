"use strict";
let AWS = require("aws-sdk");
let documentClient = new AWS.DynamoDB.DocumentClient();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

// Lambda to delete a project
module.exports.handler = async event => {
  // Only Admins and Project Managers can delete projects
  if (
    !(await hasRole(event, "Admin")) &&
    !(await hasRole(event, "ProjectManager"))
  )
    return permissionError();

  // Get the project to update by id
  try {
    let params = {
      TableName: "projects",
      Key: {
        id: event.pathParameters.id
      },
      ConditionExpression: `#owner = :u`,
      ExpressionAttributeValues: {
        ":u": event.requestContext.authorizer.claims["cognito:username"]
      },
      ExpressionAttributeNames: {
        "#owner": "owner"
      }
    };

    // Check user role
    if (await hasRole(event, "Admin")) {
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
