import React from "react";
import { Card, CardText, CardFooter } from "reactstrap";
import { DragSource } from "react-dnd";
import ProjectCardHeader from "./project/ProjectCardHeader";
import ProjectCardViewButton from "./project/ProjectCardViewButton";
import ProjectCardDeleteButton from "./project/ProjectCardDeleteButton";
import ProjectCardEditButton from "./project/ProjectCardEditButton";
import ProjectCardAccessButton from "./project/ProjectCardAccessButton";

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

class ProjectCard extends React.Component {
  state = {
    popover: false,
    modal: false
  };

  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

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

    let statusColors = {
      New: "bg-dark text-white",
      "In Progress": "bg-success text-white",
      Complete: "bg-info text-white"
    };

    let cls = statusColors[project.status];

    let isOwnerOrAdmin = project.owner === username || role.includes("Admin");

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
  checkUserExists = project => {
    return this.props.users.map(u => u.label).includes(project.owner);
  };

  removeProject = () => {
    this.props.deleteProject(this.props.project);
  };

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
