import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

let validate = input => {
  return input.length > 0;
};

let validatePassword = (input1, input2) => {
  return input1 === input2 && validate(input1);
};

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
