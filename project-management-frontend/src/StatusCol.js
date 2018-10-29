import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  CustomInput,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import { Link } from "react-router-dom";
import Project from "./Project";
import { DropTarget } from "react-dnd";

class StatusCol extends React.Component {
  render() {
    const { status, role, connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div
        className="m-3 col"
        style={{ backgroundColor: isOver && "rgba(255, 255, 255, 0.5)" }}
      >
        <Card style={{ borderRadius: "10px" }}>
          <CardHeader className="text-center">
            <h3 className="d-inline-block">{status}</h3>
            <UncontrolledButtonDropdown className="float-right">
              <DropdownToggle caret color="link" style={{ color: "black" }} />
              <DropdownMenu right>
                <DropdownItem disabled>
                  <CustomInput
                    type="radio"
                    id={"example2-" + status}
                    name="customRadio"
                    label=" View All"
                  />
                </DropdownItem>
                <DropdownItem disabled>
                  <CustomInput
                    type="radio"
                    id={"example-" + status}
                    name="customRadio"
                    label="View Assigned"
                  />
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Hide Section</DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </CardHeader>
        </Card>
        <Card
          className="mt-3"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <CardBody className="text-center">
            {this.props.projects.map(p => (
              <Project project={p} key={p.id} deleteProject={this.props.deleteProject} token = {this.props.token} username = {this.props.username} role = {this.props.role}/>
            ))}
            <div>
              {role &&
                !role.includes("Developer") && (
                  <Link to={`/projects/create/${status}`}>
                    <Button  color="link" size="lg" style={{ color: "gray" }}>
                      <FaPlusCircle />
                    </Button>
                  </Link>
                )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  addProject = item => {
    this.props.changeStatus(item, this.props.status);
  };
}

let spec = {
  drop(props, monitor, component) {
    component.addProject(monitor.getItem());
  }
};

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

export default DropTarget(["ProjectCard"], spec, collect)(StatusCol);
