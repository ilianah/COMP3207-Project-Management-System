import React from "react";
import { Card, CardText, CardFooter } from "reactstrap";
import { DragSource } from "react-dnd";
import ProjectCardHeader from "./project/ProjectCardHeader";
import ProjectCardViewButton from "./project/ProjectCardViewButton";
import ProjectCardDeleteButton from "./project/ProjectCardDeleteButton";
import ProjectCardEditButton from "./project/ProjectCardEditButton";
import ProjectCardAccessButton from "./project/ProjectCardAccessButton";

/**
 * Handle project card dragging to change project status
 */
const cardSource = {
  beginDrag(props) {
    return {
      ...props.project
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

/**
 * Deals with displaying a single project on a card and maintains the project data
 */
class ProjectCard extends React.Component {
  state = {
    popover: false,
    modal: false
  };

  // Keep track of the popovers
  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

  // Keep track of the state of the modal for viewing all information about a project
  onView = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    const {
      project,
      connectDragSource,
      isDragging,
      role,
      username
    } = this.props;

    // There are only three statuses and each is assigned its own colour
    let statusColors = {
      New: "bg-dark text-white",
      "In Progress": "bg-success text-white",
      Complete: "bg-info text-white"
    };

    let cls = statusColors[project.status];

    // Is the current user an owner or an admin to determine whether they should have access to editin/deleting a project
    let isOwnerOrAdmin = project.owner === username || role.includes("Admin");

    // Is the project owner in the list of users
    let checkUserExists = this.props.users
      ? this.props.users.map(u => u.label).includes(project.owner)
      : true;

    return connectDragSource(
      <div>
        <Card
          className={"mt-3 " + cls}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <ProjectCardHeader
            project={project}
            checkUserExists={checkUserExists}
          />
          <CardText className="text-center">{project.description} </CardText>
          <CardFooter className="text-center p-0">
            <ProjectCardViewButton
              project={project}
              statusColors={statusColors}
              onView={this.onView}
              modal={this.state.modal}
              className={this.props.className}
            />
            {isOwnerOrAdmin && <ProjectCardEditButton project={project} />}
            {isOwnerOrAdmin && (
              <ProjectCardDeleteButton
                project={project}
                onPopover={this.onPopover}
                popover={this.state.popover}
                removeProject={this.removeProject}
              />
            )}
            {!project.assignees.includes(username) && !isOwnerOrAdmin && (
              <ProjectCardAccessButton
                project={project}
                requestAccess={this.requestAccess}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Go through the list of users and check if the project owner exists (this is to be used when an owner of a project is deleted)
  checkUserExists = project => {
    return this.props.users.map(u => u.label).includes(project.owner);
  };

  // Call the API request to delete a project
  removeProject = () => {
    this.props.deleteProject(this.props.project);
  };

  // Only shown if the current user is not assigned to the project; Opens the mail client with a predefined subject and body
  requestAccess = project => {
    let ownerEmail = (
      this.props.users.filter(u => u.label === project.owner)[0] || {
        value: "ilianahadzhiatanasova@gmail.com"
      }
    ).value;
    let email =
      "mailto:" +
      ownerEmail +
      "?subject=" +
      "Request Access to " +
      project.name +
      "&body=" +
      "Hi, I would like to be added to project: " +
      project.name;
    window.location.href = email;
  };
}

export default DragSource("ProjectCard", cardSource, collect)(ProjectCard);
