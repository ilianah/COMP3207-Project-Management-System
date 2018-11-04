import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FaEdit } from "react-icons/fa";

export default ({ user, onChangeRole }) => (
  <Button
    id={"edit-" + user.username}
    color="link"
    size="lg"
    style={{ color: "black" }}
    className="p-1 mt-0"
    onClick={onChangeRole}
  >
    <FaEdit />
    <UncontrolledTooltip placement="top" target={"edit-" + user.username}>
      Change User Role
    </UncontrolledTooltip>
  </Button>
);
