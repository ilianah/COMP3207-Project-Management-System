import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default ({ modal, onError }) => {
  return (
    <Modal
      isOpen={modal}
      toggle={onError}
      className={"bg-danger text-white"}
      target={"id"}
    >
      <ModalHeader className="bg-danger text-white " toggle={onError}>
        Error signing up
      </ModalHeader>
      <ModalBody className="bg-danger text-white">
        Please check the fields and try again!
      </ModalBody>
    </Modal>
  );
};
