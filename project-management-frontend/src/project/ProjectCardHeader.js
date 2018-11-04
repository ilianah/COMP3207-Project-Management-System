import React from "react";
import { CardHeader } from "reactstrap";
export default ({ project }) => (
  <CardHeader className="text-center">
    <b>{project.name}</b> <br />
    <small>
      <i>Owned by: </i> <b>{project.owner}</b>
    </small>
  </CardHeader>
);
