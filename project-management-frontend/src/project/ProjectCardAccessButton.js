import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FaUnlockAlt } from "react-icons/fa";

// Request access to a project button with a tooltip
export default ({ project, requestAccess }) => (
  <Button
    id={"unlock-" + project.id}
    color="link"
    size="lg"
    style={{ color: "white" }}
    className="p-1 mt-0"
    onClick={() => requestAccess(project)}
  >
    <FaUnlockAlt />
    <UncontrolledTooltip placement="top" target={"unlock-" + project.id}>
      Request Access
    </UncontrolledTooltip>
  </Button>
);
