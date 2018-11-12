import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

/**
 * This is the modal to be triggered if there is a login error.
 * The modal will display the error from the event;
 */
export default ({ error, modal, onError }) => {
  return (
    <Modal
      isOpen={modal}
      toggle={onError}
      className={"bg-danger text-white"}
      target={"id"}
    >
      <ModalHeader className="bg-danger text-white " toggle={onError}>
        Error logging in
      </ModalHeader>
      <ModalBody className="bg-danger text-white">{error.message}</ModalBody>
    </Modal>
  );
};
