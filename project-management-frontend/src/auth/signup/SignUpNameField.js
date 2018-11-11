import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

let validate = input => {
  return input.length > 0;
};

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
