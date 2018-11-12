import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import makeAnimated from "react-select/lib/animated";
import { Link } from "react-router-dom";
import Select from "react-select";

// Confirm project creation button
let ConfirmButton = ({ createProject }) => (
  <Button
    type="submit"
    color="success"
    size="l"
    onClick={createProject}
    className="mt-3 mb-3 ml-2"
  >
    Confirm <FaCheck />
  </Button>
);

// Cancel project creation button and redirect back to the projects page
let CancelButton = () => (
  <Link to="/projects">
    <Button type="button" color="danger" size="l" className="mt-3 mb-3 mr-2">
      <FaTimes /> Cancel
    </Button>
  </Link>
);

/**
 * Create project Form with input validation
 * @param {*} - all the information to fill in and validate the create project form
 */
export default function CreateProjectForm({
  name,
  handleChange,
  description,
  createProject,
  statuses,
  assignees,
  isValidName,
  owner,
  isValidDescription,
  handleOwnerChange,
  handleAssigneesChange,
  users,
  status,
  handleStatusChange
}) {
  return (
    <Form style={{ width: "100%" }}>
      <FormGroup style={{ width: "30%", margin: "5px auto" }}>
        <Label for="name">
          <b>Project Name</b>
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="My project"
          value={name}
          onChange={handleChange}
          valid={isValidName(name)}
          invalid={!isValidName(name)}
        />
        <FormFeedback invalid="true">
          Project Name must be between 1 and 80 characters
        </FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: "30%", margin: "5px auto" }}>
        <Label for="description">
          <b>Project Description</b>
        </Label>
        <Input
          type="textarea"
          name="description"
          placeholder="My project description"
          value={description}
          onChange={handleChange}
          valid={isValidDescription(description)}
          invalid={!isValidDescription(description)}
        />
        <FormFeedback invalid="true">
          Project Description must be between 1 and 255 characters
        </FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: "30%", margin: "5px auto" }}>
        <Label for="owner">
          <b>Project Owner</b>
        </Label>
        <Select
          name="owner"
          value={owner}
          placeholder="Please select Project Owner"
          defaultValue={users[0]}
          onChange={handleOwnerChange}
          closeMenuOnSelect={true}
          options={users}
        />
      </FormGroup>
      <FormGroup style={{ width: "30%", margin: "5px auto" }}>
        <Label for="assignees">
          <b>Project Assignees</b>
        </Label>
        <Select
          name="assignees"
          value={assignees}
          placeholder="Please select Project Assignees"
          closeMenuOnSelect={false}
          components={makeAnimated()}
          onChange={handleAssigneesChange}
          isMulti
          options={users}
        />
      </FormGroup>
      <FormGroup style={{ width: "30%", margin: "5px auto" }}>
        <Label for="status">
          <b>Project Status</b>
        </Label>
        <br />
      </FormGroup>
      {statuses.map(s => (
        <FormGroup check inline key={s}>
          <Label check>
            <Input
              name="status"
              type="radio"
              checked={s === status}
              onChange={handleStatusChange}
              id={s}
            />
            {s}
          </Label>
        </FormGroup>
      ))}
      <br />
      <div>
        <CancelButton />
        <ConfirmButton createProject={createProject} />
      </div>
    </Form>
  );
}
