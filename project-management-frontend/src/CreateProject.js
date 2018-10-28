import React, { Component, Fragment } from "react";
import AppNavbar from "./AppNavbar";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  UncontrolledAlert
} from "reactstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import makeAnimated from "react-select/lib/animated";
import { FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";

export default class CreateProject extends Component {
  state = {
    users: [],
    name: "",
    description: "",
    owner: { label: "", value: "" },
    assignees: [],
    status: "New"
  };

  componentDidMount() {
    this.setState({ status: this.props.match.params.status || "New" });

    fetch("https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/", {
      method: "GET",
      headers: {
        Authorization: this.props.token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          users: res.map(u => ({ label: u.username, value: u.username })),
          owner: { label: this.props.username, value: this.props.username }
        });
      });
  }

  render() {
    let username = this.props.username;
    let role = this.props.role;
    let statuses = ["New", "In Progress", "Complete"];

    const users = this.state.users;

    return (
      <Fragment>
        <AppNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <div className="header" />
          <div className="form-box">
            {this.state.validationSuccess && (
              <div className="message">
                <Alert color="success">
                  <h4 className="alert-heading">Success!</h4>
                  <p>
                    Your project {this.state.name} was created successfully!
                  </p>
                  <hr />
                  <p className="mb-0">
                    <Link to="/projects/">
                      <Button color="success">
                        <FaCheck />
                      </Button>{" "}
                    </Link>
                  </p>
                </Alert>
              </div>
            )}

            {this.state.validationErrors &&
              this.state.validationErrors.map(e => (
                <div className="message" key={e}>
                  <UncontrolledAlert color="danger">
                    <h4 className="alert-heading">Error</h4>
                    <p>{e}</p>
                  </UncontrolledAlert>
                </div>
              ))}

            <Form style={{ width: "100%" }}>
              <FormGroup style={{ width: "30%", margin: "5px auto" }}>
                <Label for="name">
                  <b>Project Name</b>
                </Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="My project"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup style={{ width: "30%", margin: "5px auto" }}>
                <Label for="description">
                  <b>Project Description</b>
                </Label>
                <Input
                  type="textarea"
                  name="description"
                  placeholder="My project description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup style={{ width: "30%", margin: "5px auto" }}>
                <Label for="owner">
                  <b>Project Owner</b>
                </Label>
                <Select
                  name="owner"
                  value={this.state.owner}
                  placeholder="Please select Project Owner"
                  defaultValue={users[0]}
                  onChange={this.handleOwnerChange}
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
                  value={this.state.assignees}
                  placeholder="Please select Project Assignees"
                  closeMenuOnSelect={false}
                  components={makeAnimated()}
                  onChange={this.handleAssigneesChange}
                  isMulti
                  options={users}
                />
              </FormGroup>
              <FormGroup style={{ width: "30%", margin: "5px auto" }}>
                <Label for="status">
                  <b>Project Status</b>
                </Label>{" "}
                <br />
              </FormGroup>
              {statuses.map(s => (
                <FormGroup check inline key={s}>
                  <Label check>
                    <Input
                      name="status"
                      type="radio"
                      checked={s === this.state.status}
                      onChange={this.handleStatusChange}
                      id={s}
                    />
                    {s}
                  </Label>
                </FormGroup>
              ))}{" "}
              <br />
              <Button
                color="link"
                size="l"
                style={{ color: "black", margin: "5px auto" }}
                onClick={this.createProject}
              >
                <FaArrowRight />
              </Button>
            </Form>
          </div>
        </div>
      </Fragment>
    );
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleStatusChange = e => {
    this.setState({ status: e.target.id });
  };

  handleOwnerChange = newValue => {
    this.setState({ owner: newValue });
  };

  handleAssigneesChange = newValue => {
    this.setState({ assignees: newValue });
  };

  validateForm = callback => {
    let { name, description, owner } = this.state;
    owner = owner.value;

    let errors = [];

    if (name.length === 0 || name.length > 80)
      errors.push(
        "Project could not be created - name must be between 1 and 80 characters!"
      );

    if (description.length === 0 || description.length > 250)
      errors.push(
        "Project could not be created - description must be between 1 and 250 characters!"
      );

    if (owner.length === 0)
      errors.push("Project could not be created - please select an owner!");

    if (errors.length === 0) {
      callback();
      this.setState({ validationSuccess: true, validationErrors: [] });
    } else {
      this.setState({ validationErrors: errors, validationSuccess: false });
    }
  };

  createProject = () => {
    let { name, description, owner, assignees, status } = this.state;
    owner = owner.value;
    assignees = assignees.map(a => a.value);

    this.validateForm(() => {
      fetch(
        "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            status,
            owner,
            assignees
          }),
          headers: {
            Authorization: this.props.token
          }
        }
      )
        .then(res => res.json())
        .then(res => {
        });
    });
  };
}
