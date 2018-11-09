import React from "react";
import { CardHeader } from "reactstrap";

export default ({ project, checkUserExists }) => (
  <CardHeader className="text-center">
    <b>{project.name}</b> <br />
    <small>
      <i>Owned by: </i>
      {checkUserExists && <b>{project.owner}</b>}
      {!checkUserExists && <b>Deleted User</b>}
    </small>
  </CardHeader>
);
