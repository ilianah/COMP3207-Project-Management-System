import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

// Validate that the user input is of the form DD/MM/YYYY and the ranges are correct
// Note: the year must be between 1970 and 2000
let validate = input => {
  let regex = /\b(0[1-9]|[12][0-9]|3[01])\b\/\b(0[1-9]|[1][0-2]|)\b\/\b(19[78][0-9]|199[0-9]|2000)\b/;
  return !!input.match(regex);
};

// Field for populating the birthdate of a user that is signing up
export default ({ handleBirthdateInput, birthdate }) => (
  <FormGroup style={{ width: "30%", margin: "5px auto" }}>
    <Label for="name">
      <b>Birthday</b>
    </Label>
    <Input
      type="text"
      onChange={handleBirthdateInput}
      placeholder="DD/MM/YYYY"
      value={birthdate}
      valid={validate(birthdate)}
      invalid={!validate(birthdate) && birthdate.length > 0}
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);
