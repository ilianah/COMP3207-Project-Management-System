import React from "react";
import { Card, CardText, CardHeader, CardFooter, Button } from "reactstrap";
import { DragSource } from "react-dnd";
import { FaEdit, FaTimes, FaEye } from "react-icons/fa";

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
  render() {
    const { project, connectDragSource, isDragging } = this.props;

    let statusColors = {
      New: "bg-danger text-white",
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
            <Button
              color="link"
              size="lg"
              style={{ color: "white" }}
              className="p-1 mt-0"
            >
              <FaEdit />
            </Button>
            <Button
              color="link"
              size="lg"
              style={{ color: "white" }}
              className="p-1 mt-0"
            >
              <FaTimes />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
export default DragSource("ProjectCard", cardSource, collect)(Project);
