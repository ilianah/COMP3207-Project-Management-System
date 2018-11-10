let AWS = require("aws-sdk");

module.exports.sendEmail = (email, body, subject) => {
  let ses = new AWS.SES();
  let params = {
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

  return ses.sendEmail(params).promise();
};
