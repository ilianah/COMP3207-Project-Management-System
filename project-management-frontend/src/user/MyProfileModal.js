import React from "react";
import makeAnimated from "react-select/lib/animated";
import Loader from "react-loader";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import CreatableSelect from "react-select/lib/Creatable";
import { FaTimes, FaCheck } from "react-icons/fa";
import UpdateUserPhoto from "./UpdateUserPhoto";

export default ({
  modal,
  onUpdateProfile,
  loading,
  picture,
  skills,
  handleCreate,
  toggleModal,
  handleUpdateUserPhoto
}) => {
  let skillsOptions = [];

  if (skills.length > 0)
    skillsOptions = skills.split(",").map(e => ({ label: e, value: e }));

  console.log(picture);
  return (
    <Modal isOpen={modal} toggle={toggleModal} target={"edit"}>
      <ModalHeader>
        <b>Updating Profile</b>
      </ModalHeader>
      <ModalBody>
        {loading && <Loader loaded={!loading} />}

        {!loading && (
          <div className="text-center">
            <img
              src={picture}
              alt="avatar"
              className="rounded-circle mb-3"
              width="120"
              height="120"
            />
            <h6>Update Photo</h6>
            <UpdateUserPhoto
              picture={picture}
              handleUpdateUserPhoto={handleUpdateUserPhoto}
            />

            <h6>Add skills</h6>
            <CreatableSelect
              isMulti
              value={skillsOptions}
              onChange={handleCreate}
              components={makeAnimated()}
            />
          </div>
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
