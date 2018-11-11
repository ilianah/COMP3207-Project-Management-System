import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";
let validate = input => {
  return input.length > 0;
};

export default ({ handlePictureInput, picture }) => (
  <FormGroup style={{ width: "30%", margin: "5px auto" }}>
    <Label for="name">
      <b>Picture</b>
    </Label>
    <Input
      type="url"
      value={picture}
      onChange={handlePictureInput}
      placeholder="URL"
      valid={validate(picture)}
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);
