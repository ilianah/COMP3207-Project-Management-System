import React from "react";
import {
  Button,
  UncontrolledTooltip,
  PopoverHeader,
  PopoverBody,
  Popover
} from "reactstrap";
import { FaTrash } from "react-icons/fa";

export default ({ project, onPopover, popover, removeProject }) => (
  <Button
    id={"delete-" + project.id}
    color="link"
    size="lg"
    style={{ color: "white" }}
    className="p-1 mt-0"
    onClick={onPopover}
  >
    <FaTrash />
    <UncontrolledTooltip placement="top" target={"delete-" + project.id}>
      Delete Project
    </UncontrolledTooltip>
    <Popover
      placement="bottom"
      isOpen={popover}
      target={"delete-" + project.id}
      toggle={onPopover}
    >
      <PopoverHeader className="bg-danger text-white text-center">
        Warning
      </PopoverHeader>
      <PopoverBody className="bg-danger text-white text-center">
        You will not be able to recover the project. Are you sure you want to
        delete it? <br />
        <Button
          outline
          color="light"
          className="mt-2 text-gray"
          onClick={removeProject}
        >
          Delete
        </Button>
      </PopoverBody>
    </Popover>
  </Button>
);
