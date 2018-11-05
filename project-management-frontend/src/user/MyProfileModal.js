import React from "react";
import makeAnimated from "react-select/lib/animated";
import Loader from "react-loader";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import CreatableSelect from "react-select/lib/Creatable";
import { FaTimes, FaCheck } from "react-icons/fa";

export default ({
  modal,
  onUpdateProfile,
  loading,
  birthdate,
  skills,
  handleCreate,
  toggleModal
}) => {
  let skillsOptions = [];

  if (skills.length > 0)
    skillsOptions = skills.split(",").map(e => ({ label: e, value: e }));

  return (
    <Modal isOpen={modal} toggle={toggleModal} target={"edit"}>
      <ModalHeader>
        <b>Updating Skills</b>
      </ModalHeader>
      <ModalBody>
        {loading && <Loader loaded={!loading} />}

        {!loading && (
          <CreatableSelect
            isMulti
            value={skillsOptions}
            onChange={handleCreate}
            components={makeAnimated()}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          size="l"
          className="mt-3 mb-3 mr-2"
          onClick={toggleModal}
        >
          <FaTimes /> Cancel
        </Button>
        <Button
          color="success"
          size="l"
          className="mt-3 mb-3 ml-2"
          onClick={onUpdateProfile}
        >
          Confirm <FaCheck />
        </Button>
      </ModalFooter>
    </Modal>
  );
};
