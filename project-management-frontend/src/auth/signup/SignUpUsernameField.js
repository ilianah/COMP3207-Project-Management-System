import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

let validate = input => {
  let regex = /^[a-zA-Z0-9_]+$/;
  return !!input.match(regex);
};

export default ({ handleUsernameInput, username }) => (
  <FormGroup style={{ width: "30%", margin: "5px auto" }}>
    <Label for="name">
      <b>Username</b>
    </Label>
    <Input
      type="text"
      onChange={handleUsernameInput}
      valid={validate(username)}
      invalid={!validate(username) && username.length > 0}
      value={username}
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);
