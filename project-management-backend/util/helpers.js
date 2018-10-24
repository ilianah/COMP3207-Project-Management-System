let respondWithHeaders = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    }
});

module.exports.respondWithHeaders = respondWithHeaders;

module.exports.permissionError = () => {
    return respondWithHeaders(401, { message: 'Invalid permissions' });
}

module.exports.validationError = (message) => {
    console.log('validationError', message);
    return respondWithHeaders(400, {message});
}
module.exports.hasRole = (event, role) => {
    return (event.requestContext.authorizer.claims['cognito:groups']) === role
}
