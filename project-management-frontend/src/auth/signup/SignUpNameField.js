import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

// Validate that the user has inputted something
let validate = input => {
  return input.length > 0;
};

// Field for populating the name of a user that is signing up
export default ({ handleNameInput, name }) => (
  <FormGroup style={{ width: "30%", margin: "5px auto" }}>
    <Label for="name">
      <b>Name</b>
    </Label>
    <Input
      type="text"
      onChange={handleNameInput}
      valid={validate(name)}
      value={name}
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);
