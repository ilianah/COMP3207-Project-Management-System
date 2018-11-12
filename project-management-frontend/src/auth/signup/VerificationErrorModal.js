import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

/**
 * This is the modal to be triggered if there is a verification error.
 */
export default ({ modal, onError, error }) => {
  return (
    <Modal
      isOpen={modal}
      toggle={onError}
      className={"bg-danger text-white"}
      target={"id"}
    >
      <ModalHeader className="bg-danger text-white " toggle={onError}>
        Error verifying user
      </ModalHeader>
      <ModalBody className="bg-danger text-white">Please try again!</ModalBody>
    </Modal>
  );
};
