import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FaEnvelope } from "react-icons/fa";

/**
 * Icon for emailing a user and appropriate actions
 */
export default ({ user }) => (
  <a href={"mailto:" + user.email}>
    <Button
      id={"email-" + user.username}
      color="link"
      size="lg"
      style={{ color: "black" }}
      className="p-1 mt-0"
    >
      <FaEnvelope />
      <UncontrolledTooltip placement="top" target={"email-" + user.username}>
        Email {user.username}
      </UncontrolledTooltip>
    </Button>
  </a>
);
