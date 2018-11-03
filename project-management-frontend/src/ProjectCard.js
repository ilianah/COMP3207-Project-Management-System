import React from "react";
import {
  Card,
  CardText,
  CardHeader,
  CardFooter,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip
} from "reactstrap";
import { DragSource } from "react-dnd";
import { FaEdit, FaTrash, FaEye, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    modal: false,
    users: []
  };

  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

  onView = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  componentDidMount = () => {
    fetch("https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/", {
      method: "GET",
      headers: {
        Authorization: this.props.token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          users: res.map(u => ({ label: u.username, value: u.email }))
        });
      });
  };

  render() {
    const { project, connectDragSource, isDragging } = this.props;

    let statusColors = {
      New: "bg-dark text-white",
      "In Progress": "bg-success text-white",
      Complete: "bg-info text-white"
    };

    let cls = statusColors[project.status];

    return connectDragSource(
      <div>
        <Card
          className={"mt-3 " + cls}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <CardHeader className="text-center">
            <b>{project.name}</b> <br />
            <small>
              <i>Owned by: </i> <b>{project.owner}</b>
            </small>
          </CardHeader>
          <CardText className="text-center">{project.description} </CardText>
          <CardFooter className="text-center p-0">
            <Button
              id={"view-" + project.id}
              color="link"
              size="lg"
              style={{ color: "white" }}
              className="p-1 mt-0"
              onClick={this.onView}
            >
              <FaEye />
              <UncontrolledTooltip
                placement="top"
                target={"view-" + project.id}
              >
                View Project
              </UncontrolledTooltip>

              <Modal
                isOpen={this.state.modal}
                toggle={this.onView}
                className={this.props.className}
                target={"view-" + project.id}
              >
                <ModalHeader
                  className={statusColors[project.status]}
                  toggle={this.onView}
                >
                  {" "}
                  <b>{project.name}</b>
                  <small>
                    <i> (Owned by: </i> <b>{project.owner}</b>)
                  </small>{" "}
                  <br />
                </ModalHeader>
                <ModalBody className={statusColors[project.status]}>
                  {" "}
                  {project.description}{" "}
                </ModalBody>
                <ModalFooter
                  className={
                    "justify-content-start " + statusColors[project.status]
                  }
                >
                  <i>Project Assignees: </i>{" "}
                  <b>{project.assignees.join(", ")} </b>
                </ModalFooter>
              </Modal>
            </Button>
            {(this.props.project.owner === this.props.username ||
              this.props.role.includes("Admin")) && (
              <Link to={`/projects/update/${project.id}`}>
                <Button
                  id={"edit-" + project.id}
                  color="link"
                  size="lg"
                  style={{ color: "white" }}
                  className="p-1 mt-0"
                >
                  <FaEdit />
                  <UncontrolledTooltip
                    placement="top"
                    target={"edit-" + project.id}
                  >
                    Edit Project
                  </UncontrolledTooltip>
                </Button>
              </Link>
            )}
            {(this.props.project.owner === this.props.username ||
              this.props.role.includes("Admin")) && (
              <Button
                id={"delete-" + project.id}
                color="link"
                size="lg"
                style={{ color: "white" }}
                className="p-1 mt-0"
                onClick={this.onPopover}
              >
                <FaTrash />
                <UncontrolledTooltip
                  placement="top"
                  target={"delete-" + project.id}
                >
                  Delete Project
                </UncontrolledTooltip>
                <Popover
                  placement="bottom"
                  isOpen={this.state.popover}
                  target={"delete-" + project.id}
                  toggle={this.onPopover}
                >
                  <PopoverHeader className="bg-danger text-white text-center">
                    Warning
                  </PopoverHeader>
                  <PopoverBody className="bg-danger text-white text-center">
                    You will not be able to recover the project. Are you sure
                    you want to delete it? <br />
                    <Button
                      outline
                      color="light"
                      className="mt-2 text-gray"
                      onClick={this.removeProject}
                    >
                      Delete
                    </Button>{" "}
                  </PopoverBody>
                </Popover>
              </Button>
            )}

            {!this.props.project.assignees.includes(this.props.username) &&
              this.props.owner !== this.props.username &&
              !this.props.role.includes("Admin") && (
                <Button
                  id={"unlock-" + project.id}
                  color="link"
                  size="lg"
                  style={{ color: "white" }}
                  className="p-1 mt-0"
                  onClick={() => this.requestAccess(project)}
                >
                  <FaUnlockAlt />
                  <UncontrolledTooltip
                    placement="top"
                    target={"unlock-" + project.id}
                  >
                    Request Access
                  </UncontrolledTooltip>
                </Button>
              )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  removeProject = () => {
    this.props.deleteProject(this.props.project);
  };

  requestAccess = project => {
    let ownerEmail = this.state.users.filter(u => u.label === project.owner)[0]
      .value;
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
