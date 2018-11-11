let AWS = require("aws-sdk");

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

module.exports.sendEmail = (email, body, subject) => {
  let ses = new AWS.SES();
  let params = getEmailParams(email, body, subject);
  return ses.sendEmail(params).promise();
};
