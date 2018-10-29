import React from "react";
import {
  Card,
  CardText,
  CardHeader,
  CardFooter,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import { DragSource } from "react-dnd";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
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

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popover: false
    };
  }

  toggle() {
    this.setState({ popover: !this.state.popover });
  }
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
              color="link"
              size="lg"
              style={{ color: "white" }}
              className="p-1 mt-0"
            >
              <FaEye />
            </Button>
            <Link to={`/projects/update/${project.id}`}>
            <Button
              color="link"
              size="lg"
              style={{ color: "white" }}
              className="p-1 mt-0"
            >
              <FaEdit />
            </Button>
            </Link>
            {(this.props.project.owner === this.props.username ||
              this.props.role.includes("Admin")) && (
              <Button
                id={"delete-" + project.id}
                color="link"
                size="lg"
                style={{ color: "white" }}
                className="p-1 mt-0"
                onClick={this.toggle}
              >
                <FaTrash />
                <Popover
                  placement="bottom"
                  isOpen={this.state.popover}
                  target={"delete-" + project.id}
                  toggle={this.toggle}
                >
                  <PopoverHeader className="bg-danger text-white text-center">
                    Warning
                  </PopoverHeader>
                  <PopoverBody className="bg-danger text-white text-center">
                    You will not be able to recover the project. Are you sure
                    you want to delete it? <br />
                    <Button outline color="light" className="mt-2 text-gray" onClick={this.removeProject}>
                      Delete
                    </Button>{" "}
                  </PopoverBody>
                </Popover>
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
}
export default DragSource("ProjectCard", cardSource, collect)(Project);


