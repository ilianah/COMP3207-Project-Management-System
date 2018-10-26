let respondWithHeaders = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    }
});

let validationError = (message) => {
    console.log('validationError', message);
    return respondWithHeaders(400, { message });
}

module.exports.respondWithHeaders = respondWithHeaders;

module.exports.validationError = validationError;

module.exports.permissionError = () => {
    return respondWithHeaders(401, { message: 'Invalid permissions' });
}

module.exports.validationCheck = (body) => {

    if (!body.name || body.name.length === 0 || body.name.length > 80)
        return validationError('Project name must be between 1 and 80 characters');

    if (!body.description || body.description.length == 0 || body.description.length > 250)
        return validationError('Project description must be between 1 and 250 characters');

    if (!body.status || (body.status != 'New' && body.status != 'In progress' && body.status != "Completed"))
        return validationError('Invalid project status');

    if (!body.owner || body.owner.length === 0)
        return validationError("Each project must have a project owner!");

    if (!body.assignees || !(Array.isArray(body.assignees)) || body.assignees.length < 1)
        return validationError("Invalid assignees");
}

module.exports.hasRole = (event, role) => {
    return (event.requestContext.authorizer.claims['cognito:groups']) === role
}
