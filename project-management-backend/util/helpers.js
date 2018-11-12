let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();

let respondWithHeaders = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
});

let validationError = message => {
  return respondWithHeaders(400, { message });
};

module.exports.respondWithHeaders = respondWithHeaders;

module.exports.validationError = validationError;

// Returned when a user with a specific role is not authorised to perform certain action
module.exports.permissionError = () => {
  return respondWithHeaders(401, { message: "Invalid permissions" });
};

// Validate the project body
module.exports.validationCheck = body => {
  if (!body.name || body.name.length === 0 || body.name.length > 80)
    return validationError("Project name must be between 1 and 80 characters");

  if (
    !body.description ||
    body.description.length == 0 ||
    body.description.length > 250
  )
    return validationError(
      "Project description must be between 1 and 250 characters"
    );

  if (
    !body.status ||
    (body.status != "New" &&
      body.status != "In Progress" &&
      body.status != "Complete")
  )
    return validationError("Invalid project status");

  if (!body.owner || body.owner.length === 0)
    return validationError("Each project must have a project owner!");

  if (!body.assignees || !Array.isArray(body.assignees))
    return validationError("Invalid assignees");
};

// Check a user against a specific role
module.exports.hasRole = async (event, role) => {
  let res = await cognitoClient
    .adminListGroupsForUser({
      UserPoolId: "us-east-1_p4KcysLln",
      Username: event.requestContext.authorizer.claims["cognito:username"]
    })
    .promise();

  return res.Groups.map(g => g.GroupName).includes(role);
};
