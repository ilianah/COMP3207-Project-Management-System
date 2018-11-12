import React from "react";
import {
  Button,
  UncontrolledTooltip,
  PopoverHeader,
  PopoverBody,
  Popover
} from "reactstrap";
import { FaTrash } from "react-icons/fa";

/**
 * Frontend elements for deleting a user
 */
export default ({ user, onPopover, removeUser, popover }) => (
  <Button
    id={"delete-" + user.username}
    color="link"
    size="lg"
    style={{ color: "black" }}
    className="p-1 mt-0"
    onClick={onPopover}
  >
    <FaTrash />
    <UncontrolledTooltip placement="top" target={"delete-" + user.username}>
      Delete User
    </UncontrolledTooltip>
    <Popover
      placement="bottom"
      isOpen={popover}
      target={"delete-" + user.username}
      toggle={onPopover}
    >
      <PopoverHeader className="bg-danger text-white text-center">
        Warning
      </PopoverHeader>
      <PopoverBody className="bg-danger text-white text-center">
        You will not be able to recover {user.username}. Are you sure you want
        to delete them? <br />
        <Button
          outline
          color="light"
          className="mt-2 text-gray"
          onClick={removeUser}
        >
          Delete
        </Button>
      </PopoverBody>
    </Popover>
  </Button>
);
