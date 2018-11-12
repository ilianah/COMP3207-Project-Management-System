import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

// Check if the user input is a valid format for an email
let validate = input => {
  let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return !!input.match(regex);
};

// Field for populating the email of a user that is signing up
export default ({ handleEmailInput, email }) => (
  <FormGroup style={{ width: "30%", margin: "5px auto" }}>
    <Label for="name">
      <b>Email Address</b>
    </Label>
    <Input
      type="email"
      onChange={handleEmailInput}
      valid={validate(email)}
      invalid={!validate(email) && email.length > 0}
      value={email}
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);
