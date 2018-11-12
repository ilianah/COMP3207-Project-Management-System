import React from "react";
import MNavbar from "./MNavbar";
import StatusCol from "./StatusCol";
import { Row } from "reactstrap";
import Loader from "react-loader";
import Searchbar from "./Searchbar";
import {
  getProjects,
  updateProject,
  deleteProject,
  getUsers
} from "./util/requests";

/**
 * Display all projects in columns corresponding to their statuses
 * Hold search filter information to filter projects by
 */
export default class ProjectsList extends React.Component {
  state = {
    projects: [],
    filter: ""
  };

  // The state of the list should be loading
  componentDidMount() {
    this.setState({
      loading: true
    });

    getProjects(this.props.token).then(res => {
      this.setState({ projects: res, loading: false });
    });

    getUsers(this.props.token).then(res => {
      this.setState({
        users: res.map(u => ({ label: u.username, value: u.email }))
      });
    });
  }

  render() {
    let username = this.props.username;
    let role = this.props.role;

    let statuses = ["New", "In Progress", "Complete"];

    return (
      <React.Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <Loader loaded={!this.state.loading} />

        <div className="background " />

        <Searchbar
          value={this.state.filter}
          onChange={this.onFilterChange}
          placeholder="Search by Project Name"
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
                projects={this.state.projects
                  .filter(p => p.status === s)
                  .filter(p =>
                    p.name
                      .toLowerCase()
                      .includes(this.state.filter.toLowerCase())
                  )}
                username={this.props.username}
                token={this.props.token}
                filter={this.state.filter}
                users={this.state.users}
              />
            ))}
          </Row>
        </div>
      </React.Fragment>
    );
  }

  // Handle status changing when a project card is dragged into a different column
  changeStatus = (project, status) => {
    let newProject = { ...project, status };
    let projects = [...this.state.projects];
    projects = projects.filter(p => p.id !== project.id);
    projects.push(newProject);
    this.setState({ projects });

    // An API request should be sent to update the project with the new status
    updateProject(this.props.token, newProject);
  };

  // Filtering the projects by search value
  onFilterChange = e => {
    this.setState({ filter: e.target.value.replace(/[^a-zA-Z0-9]/, "") });
  };

  // API request to delete a project
  deleteProject = project => {
    let projects = [...this.state.projects];
    projects = projects.filter(p => p.id !== project.id);
    this.setState({ projects });
    if (
      project.owner === this.props.username ||
      this.props.role.includes("Admin")
    ) {
      deleteProject(this.props.token, project.id);
    }
  };
}
