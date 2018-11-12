let AWS = require("aws-sdk");

// Get all the email parameters
let getEmailParams = (email, body, subject) => {
  return {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          Data: body,
          Charset: "UTF-8"
        }
      },
      Subject: {
        Data: subject,
        Charset: "UTF-8"
      }
    },
    Source: "ilianahadzhiatanasova@gmail.com"
  };
};

module.exports.getEmailParams = getEmailParams;

// Send an email with the email params
module.exports.sendEmail = (email, body, subject) => {
  let ses = new AWS.SES();
  let params = getEmailParams(email, body, subject);
  return ses.sendEmail(params).promise();
};
