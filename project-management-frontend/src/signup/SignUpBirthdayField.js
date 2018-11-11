import React from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";
let validate = input => {
  let regex = /\b(0[1-9]|[12][0-9]|3[01])\b\/\b(0[1-9]|[1][0-2]|)\b\/\b(19[78][0-9]|199[0-9]|2000)\b/;
  return !! input.match(regex);
};
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
