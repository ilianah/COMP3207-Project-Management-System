import React, { Component, Fragment } from "react";
import MNavbar from "./MNavbar";
import StatusCol from "./StatusCol";
import { Row } from "reactstrap";
import Loader from "react-loader";
import Searchbar from "./Searchbar";

export default class ProjectsList extends Component {
  state = {
    projects: [],
    filter: ""
  };

  componentDidMount() {
    this.setState({
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
        this.setState({ projects: res, loading: false });
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
        {this.state.loading && <Loader loaded={!this.state.loading} />}

        <div className="background " />

        <Searchbar
          value={this.state.filter}
          onChange={this.onFilterChange}
        />
        <div>
          <Row>
            {statuses.map(s => (
              <StatusCol
                changeStatus={this.changeStatus}
                deleteProject={this.deleteProject}
                role={role}
                key={s}
                status={s}
                projects={this.state.projects.filter(p => p.status === s).filter(p => p.name.toLowerCase().includes(this.state.filter.toLowerCase()))}
                username={this.props.username}
                token={this.props.token}
                filter = {this.state.filter}
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

  onFilterChange = e => {
    this.setState({ filter: e.target.value });
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
