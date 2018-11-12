import React from "react";
import { CardHeader } from "reactstrap";

/**
 *  Project Card Header containig information about the project name and project owner
 *  Considers if the project owner is deleted and displays information accordingly
 */
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
