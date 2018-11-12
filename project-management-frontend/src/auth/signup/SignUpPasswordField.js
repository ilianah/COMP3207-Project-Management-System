import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

// Validate that the user has inputed something
let validate = input => {
  return input.length > 0;
};

// Compares two strings for equality - used to compare the 2 passwords
let validatePassword = (input1, input2) => {
  return input1 === input2 && validate(input1);
};

// Fields for populating the password of a user that is signing up
export default ({
  handlePasswordInput,
  handleRepeatedPasswordInput,
  password,
  repeatedPassword
}) => (
  <div>
    <FormGroup style={{ width: "30%", margin: "5px auto" }}>
      <Label for="description">
        <b>Password</b>
      </Label>
      <Input
        type="password"
        onChange={handlePasswordInput}
        valid={validate(password)}
        value={password}
      />
      <FormFeedback invalid="true" />
    </FormGroup>

    <FormGroup style={{ width: "30%", margin: "5px auto" }}>
      <Label for="description">
        <b>Repeat Password</b>
      </Label>
      <Input
        type="password"
        value={repeatedPassword}
        onChange={handleRepeatedPasswordInput}
        valid={validatePassword(password, repeatedPassword)}
        invalid={
          !validatePassword(password, repeatedPassword) &&
          repeatedPassword.length > 0
        }
      />
      <FormFeedback invalid="true" />
    </FormGroup>
  </div>
);
