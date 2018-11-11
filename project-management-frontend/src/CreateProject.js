import React from "react";
import MNavbar from "./MNavbar";
import { Button, Alert, UncontrolledAlert } from "reactstrap";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Loader from "react-loader";
import {
  getUsers,
  getProjects,
  updateProject,
  createProject
} from "./util/requests";
import CreateProjectForm from "./project/CreateProjectForm";

export default class CreateProject extends React.Component {
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
        isUpdating: false,
        usersLoading: true
      });
    } else {
      this.setState({
        isUpdating: true,
        id: this.props.match.params.id,
        loading: true
      });
    }

    getUsers(this.props.token).then(res => {
      this.setState(prevState => {
        let newState = {
          users: res.map(u => ({ label: u.username, value: u.username })),
          owner: { label: this.props.username, value: this.props.username },
          usersLoading: false
        };

        if (prevState.isUpdating) delete newState.owner;

        return newState;
      });

      if (this.props.match.params.id) {
        getProjects(this.props.token).then(pRes => {
          let project = pRes.find(p => p.id === this.props.match.params.id);
          project.owner = pRes.map(u => u.username).includes(project.owner)
            ? project.owner
            : this.props.username;
          project.owner = { label: project.owner, value: project.owner };
          project.assignees = project.assignees
            .filter(a => res.map(u => u.username).includes(a))
            .map(a => ({
              label: a,
              value: a
            }));

          this.setState({
            ...project,
            loading: false
          });
        });
      }
    });
  }

  isValidName = name => {
    return name.length > 0 && name.length < 80;
  };

  isValidDescription = description => {
    return description.length > 0 && description.length < 255;
  };

  render() {
    let username = this.props.username;
    let role = this.props.role;
    let statuses = ["New", "In Progress", "Complete"];

    const users = this.state.users;

    let header = (
      <div className="action">
        <h1>
          {this.state.isUpdating ? "Editing" : "Creating"} project{" "}
          {this.state.name}{" "}
        </h1>
      </div>
    );

    let SuccessMessage = () => (
      <div className="message">
        <Alert color="success">
          <h4 className="alert-heading">Success!</h4>
          <p>
            Your project {this.state.name} was{" "}
            {this.state.isUpdating ? "updated" : "created"} successfully!
          </p>
          <hr />
          <p className="mb-0">
            <Link to="/projects/">
              <Button color="success">
                <FaCheck />
              </Button>
            </Link>
          </p>
        </Alert>
      </div>
    );

    return (
      <React.Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <div className="header" />

          <Loader loaded={!this.state.usersLoading} />
          <Loader loaded={!this.state.loading} />

          {header}

          {!this.state.loading && !this.state.usersLoading && (
            <div className="form-box">
              {this.state.validationSuccess ? (
                <SuccessMessage />
              ) : (
                <React.Fragment>
                  {this.state.validationErrors &&
                    this.state.validationErrors.map(e => (
                      <div className="message" key={e}>
                        <UncontrolledAlert color="danger">
                          <h4 className="alert-heading">Error</h4>
                          <p>{e}</p>
                        </UncontrolledAlert>
                      </div>
                    ))}

                  <CreateProjectForm
                    name={this.state.name}
                    handleChange={this.handleChange}
                    description={this.state.description}
                    createProject={this.createProject}
                    statuses={statuses}
                    assignees={this.state.assignees}
                    isValidName={this.isValidName}
                    owner={this.state.owner}
                    isValidDescription={this.isValidDescription}
                    handleOwnerChange={this.handleOwnerChange}
                    handleAssigneesChange={this.handleAssigneesChange}
                    users={users}
                    status={this.state.status}
                    handleStatusChange={this.handleStatusChange}
                  />
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
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

    let partialProj = { name, description, status, assignees, owner };
    this.validateForm(() => {
      if (this.state.isUpdating) {
        updateProject(this.props.token, {
          id,
          ...partialProj
        });
      } else {
        createProject(this.props.token, partialProj);
      }
    });
  };
}
