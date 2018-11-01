import React, { Component, Fragment } from "react";
import MNavbar from "./MNavbar";
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Alert,
  UncontrolledAlert
} from "reactstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import makeAnimated from "react-select/lib/animated";
import { FaTimes, FaCheck } from "react-icons/fa";
import Loader from "react-loader";

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
    if (this.props.match.params.status) {
      this.setState({
        status: this.props.match.params.status || "New",
        isUpdating: false
      });
    } else if (this.props.match.params.id) {
      this.setState({
        isUpdating: true,
        id: this.props.match.params.id,
        loading: true
      });

      fetch(
        "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/",
        {
          method: "GET",
          headers: {
            Authorization: this.props.token
          }
        }
      )
        .then(res => res.json())
        .then(res => {
          let project = res.find(p => p.id === this.props.match.params.id);
          project.owner = { label: project.owner, value: project.owner };
          project.assignees = project.assignees.map(a => ({
            label: a,
            value: a
          }));
          this.setState({
            ...project,
            loading: false
          });
        });
    }

    fetch("https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/", {
      method: "GET",
      headers: {
        Authorization: this.props.token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState(prevState => {
          let newState = {
            users: res.map(u => ({ label: u.username, value: u.username })),
            owner: { label: this.props.username, value: this.props.username }
          };

          if (prevState.isUpdating) delete newState.owner;

          return newState;
        });
      });
  }

  isValidName = name => {
    if (name.length > 0 && name.length < 80) return true;
    return false;
  };

  isValidDescription = description => {
    if (description.length > 0 && description.length < 255) return true;
    return false;
  };

  render() {
    let username = this.props.username;
    let role = this.props.role;
    let statuses = ["New", "In Progress", "Complete"];

    const users = this.state.users;

    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <div className="header" />

          {!this.state.isUpdating && (
            <div className="action">
              <h1>Creating project {this.state.name} </h1>
            </div>
          )}

          {this.state.isUpdating && (
            <div className="action">
              <h1>Editing project {this.state.name} </h1>
            </div>
          )}

          {this.state.loading && <Loader loaded={!this.state.loading} />}

          {!this.state.loading && (
            <div className="form-box">
              {this.state.validationSuccess &&
                !this.state.isUpdating && (
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

              {this.state.validationSuccess &&
                this.state.isUpdating && (
                  <div className="message">
                    <Alert color="success">
                      <h4 className="alert-heading">Success!</h4>
                      <p>
                        Your project {this.state.name} was updated successfully!
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
                    valid={this.isValidName(this.state.name)}
                    invalid={!this.isValidName(this.state.name)}
                  />
                  <FormFeedback invalid>
                    {" "}
                    Project Name must be between 1 and 80 characters{" "}
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
                    value={this.state.description}
                    onChange={this.handleChange}
                    valid={this.isValidDescription(this.state.description)}
                    invalid={!this.isValidDescription(this.state.description)}
                  />
                  <FormFeedback invalid>
                    {" "}
                    Project Description must be between 1 and 255 characters{" "}
                  </FormFeedback>
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
                <div>
                  <Link to="/projects">
                    <Button color="danger" size="l" className="mt-3 mb-3 mr-2">
                      <FaTimes /> Cancel
                    </Button>
                  </Link>
                  <Button
                    color="success"
                    size="l"
                    onClick={this.createProject}
                    className="mt-3 mb-3 ml-2"
                  >
                    Confirm <FaCheck />
                  </Button>
                </div>
              </Form>
            </div>
          )}
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
    let { name, description, owner, assignees, status, id } = this.state;
    owner = owner.value;
    assignees = assignees.map(a => a.value);

    this.validateForm(() => {
      if (this.state.isUpdating) {
        fetch(
          "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/",
          {
            method: "PUT",
            body: JSON.stringify({
              id,
              name,
              description,
              status,
              assignees,
              owner
            }),
            headers: {
              Authorization: this.props.token
            }
          }
        ).then(res => res.json());
      } else {
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
          .then(res => {});
      }
    });
  };
}
