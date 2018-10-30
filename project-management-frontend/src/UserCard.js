import React from "react";
import {
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  UncontrolledTooltip,
  Popover,
  PopoverBody,
  PopoverHeader
} from "reactstrap";
import {
  FaBirthdayCake,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaTrash
} from "react-icons/fa";

class UserCard extends React.Component {
  constructor(props) {
    super(props);

    this.onPopover = this.onPopover.bind(this);

    this.state = {
      popover: false
    };
  }
  onPopover() {
    this.setState({ popover: !this.state.popover });
  }
  render() {
    const { user } = this.props;

    return (
      <Col sm="4" className="text-center">
        <Card
          className="mt-3 ml-3 mr-3 mb-3"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          {" "}
          <CardHeader className="text-center">
            {" "}
            <h3>{user.name}</h3>{" "}
          </CardHeader>
          <CardBody>
            <img
              src={user.picture}
              alt="avatar"
              className="rounded-circle"
              width="120"
              height="120"
            />{" "}
            <h5>
              {" "}
              <FaUser /> {user.username}
            </h5>
            <h5>
              {" "}
              <FaEnvelope /> {user.email}
            </h5>
            <h5>
              {" "}
              <FaBirthdayCake /> {user.birthdate}
            </h5>
          </CardBody>
          <CardFooter>
            <Button
              id={"email-" + user.username}
              color="link"
              size="lg"
              style={{ color: "black" }}
              className="p-1 mt-0"
            >
              <FaEnvelope />
              <UncontrolledTooltip
                placement="top"
                target={"email-" + user.username}
              >
                Email {user.username}{" "}
              </UncontrolledTooltip>
            </Button>
            <Button
              id={"edit-" + user.username}
              color="link"
              size="lg"
              style={{ color: "black" }}
              className="p-1 mt-0"
            >
              <FaEdit />
              <UncontrolledTooltip
                placement="top"
                target={"edit-" + user.username}
              >
                Change User Role
              </UncontrolledTooltip>
            </Button>
            <Button
              id={"delete-" + user.username}
              color="link"
              size="lg"
              style={{ color: "black" }}
              className="p-1 mt-0"
              onClick={this.onPopover}
            >
              <FaTrash />
              <UncontrolledTooltip
                placement="top"
                target={"delete-" + user.username}
              >
                Delete User
              </UncontrolledTooltip>
              <Popover
                placement="bottom"
                isOpen={this.state.popover}
                target={"delete-" + user.username}
                toggle={this.onPopover}
              >
                <PopoverHeader className="bg-danger text-white text-center">
                  Warning
                </PopoverHeader>
                <PopoverBody className="bg-danger text-white text-center">
                  You will not be able to recover {user.username}. Are you sure
                  you want to delete them? <br />
                  <Button
                    outline
                    color="light"
                    className="mt-2 text-gray"
                    onClick={this.removeUser}
                  >
                    Delete
                  </Button>{" "}
                </PopoverBody>
              </Popover>
            </Button>
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

export default UserCard;
