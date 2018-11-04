import React from "react";
import { Link } from "react-router-dom";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FaEdit } from "react-icons/fa";

export default ({ project }) => (
  <Link to={`/projects/update/${project.id}`}>
    <Button
      id={"edit-" + project.id}
      color="link"
      size="lg"
      style={{ color: "white" }}
      className="p-1 mt-0"
    >
      <FaEdit />
      <UncontrolledTooltip placement="top" target={"edit-" + project.id}>
        Edit Project
      </UncontrolledTooltip>
    </Button>
  </Link>
);
