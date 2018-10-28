import React, { Component, Fragment } from "react";
import MNavbar from "./MNavbar";
import StatusCol from "./StatusCol";
import { Row } from "reactstrap";

export default class ProjectsList extends Component {
  state = { projects: [] };

  componentDidMount() {
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
        this.setState({ projects: res });
      });
  }

  render() {
    let username = this.props.username;
    let role = this.props.role;

    let statuses = ["New", "In Progress", "Complete"];

    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <Row>
            {statuses.map(s => (
              <StatusCol
                changeStatus={this.changeStatus}
                deleteProject={this.deleteProject}
                role={role}
                key={s}
                status={s}
                projects={this.state.projects.filter(p => p.status === s)}
                username={this.props.username}
                token={this.props.token}
              />
            ))}
          </Row>
        </div>
      </Fragment>
    );
  }

  changeStatus = (project, status) => {
    let newProject = { ...project, status };
    let projects = [...this.state.projects];
    projects = projects.filter(p => p.id !== project.id);
    projects.push(newProject);
    this.setState({ projects });

    fetch(
      "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/",
      {
        method: "PUT",
        body: JSON.stringify(newProject),
        headers: {
          Authorization: this.props.token
        }
      }
    ).then(res => res.json());
  };

  deleteProject = project => {
    let projects = [...this.state.projects];
    projects = projects.filter(p => p.id !== project.id);
    this.setState({ projects });
    if (
      project.owner === this.props.username ||
      this.props.role.includes("Admin")
    ) {
      fetch(
        "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/" +
          project.id,
        {
          method: "DELETE",

          headers: {
            Authorization: this.props.token
          }
        }
      ).then(res => res.text());
    }
  };
}
