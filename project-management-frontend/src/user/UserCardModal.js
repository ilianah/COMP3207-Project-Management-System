import React from "react";
import makeAnimated from "react-select/lib/animated";
import Loader from "react-loader";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup
} from "reactstrap";
import Select from "react-select";
import { FaTimes, FaCheck } from "react-icons/fa";

/**
 * Modal that appears when an admin is to change a user role
 */
export default ({
  username,
  modal,
  onChangeRole,
  changeUserRole,
  handleRoleChange,
  loading,
  roles
}) => (
  <Modal isOpen={modal} toggle={onChangeRole} target={"edit-" + username}>
    <ModalHeader>
      <b>Changing role of {username}</b>
    </ModalHeader>
    <ModalBody>
      {loading && <Loader loaded={!loading} />}

      {!loading && (
        <FormGroup style={{ margin: "5px auto" }}>
          <Select
            name="assignees"
            onChange={handleRoleChange}
            placeholder={"Please select new role for " + username}
            components={makeAnimated()}
            value={(roles || []).map(r => ({
              value: r,
              label: r
            }))}
            options={["Admin", "Developer", "ProjectManager"].map(r => ({
              label: r,
              value: r
            }))}
          />
        </FormGroup>
      )}
    </ModalBody>
    <ModalFooter>
      <Button
        type="button"
        color="danger"
        size="l"
        className="mt-3 mb-3 mr-2"
        onClick={onChangeRole}
      >
        <FaTimes /> Cancel
      </Button>
      <Button
        type="submit"
        color="success"
        size="l"
        className="mt-3 mb-3 ml-2"
        onClick={changeUserRole}
      >
        Confirm <FaCheck />
      </Button>
    </ModalFooter>
  </Modal>
);
