import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

/**
 * Project Card modal containing all information about a project
 */
export default ({ project, statusColors, modal, className, onView }) => {
  return (
    <Modal
      isOpen={modal}
      toggle={onView}
      className={className}
      target={"view-" + project.id}
    >
      <ModalHeader className={statusColors[project.status]} toggle={onView}>
        <b>{project.name}</b>
        <small>
          <i> (Owned by: </i> <b>{project.owner}</b>)
        </small>
        <br />
      </ModalHeader>
      <ModalBody className={statusColors[project.status]}>
        {project.description}
      </ModalBody>
      <ModalFooter
        className={"justify-content-start " + statusColors[project.status]}
      >
        <i>Project Assignees: </i> <b>{project.assignees.join(", ")} </b>
      </ModalFooter>
    </Modal>
  );
};
