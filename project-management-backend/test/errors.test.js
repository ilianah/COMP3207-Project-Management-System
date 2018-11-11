let validationError = require("../util/helpers").validationError;
let permissionError = require("../util/helpers").permissionError;
let validationCheck = require("../util/helpers").validationCheck;
let getEmailParams = require("../util/sendEmail").getEmailParams;

let chai = require("chai"),
  expect = chai.expect;

let emptyBody = {
  name: "",
  description: "",
  status: "",
  owner: "",
  assignees: ""
};

let emptyName = {
  name: "",
  description: "Description",
  status: "New",
  owner: "",
  assignees: ""
};

let invalidStatus = {
  name: "Name",
  description: "Description",
  status: "Inexisting Status",
  owner: "owner",
  assignees: ["assignee"]
};

let incorrectAssigneeType = {
  name: "Name",
  description: "Description",
  status: "New",
  owner: "owner",
  assignees: "Incorrect type - should be an array, but is a string"
};

describe("ValidationError tests", () => {
  it("should be 400 status code", () => {
    expect(validationError("msg").statusCode).to.be.equal(400);
    expect(validationError().statusCode).to.be.equal(400);
  });

  it("should have the correct message", () => {
    expect(validationError("some validation error").body).to.be.equal(
      JSON.stringify({ message: "some validation error" })
    );
  });
});

describe("Validate input tests", () => {
  it("should be 400 status code for incorrect body", () => {
    expect(validationCheck(emptyBody).statusCode).to.be.equal(400);
    expect(validationCheck(emptyName).statusCode).to.be.equal(400);
    expect(validationCheck(invalidStatus).statusCode).to.be.equal(400);
    expect(validationCheck(incorrectAssigneeType).statusCode).to.be.equal(400);
  });
});

describe("Permission Error tests", () => {
  it("should be 401 status code for incorrect body", () => {
    expect(permissionError().statusCode).to.be.equal(401);
  });
});

describe("Email tests", () => {
  it("should get the correct email params", () => {
    expect(
      getEmailParams("ilianahadzhiatanasova@gmail.com", "Body", "Subject")
        .Destination.ToAddresses
    ).to.include("ilianahadzhiatanasova@gmail.com");
    expect(
      getEmailParams("ilianahadzhiatanasova@gmail.com", "Body", "Subject")
        .Message.Body.Text.Data
    ).to.include("Body");
    expect(
      getEmailParams("ilianahadzhiatanasova@gmail.com", "Body", "Subject")
        .Message.Subject.Data
    ).to.include("Subject");
  });
});
