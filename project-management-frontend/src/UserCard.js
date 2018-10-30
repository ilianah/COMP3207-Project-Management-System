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
  PopoverHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup
} from "reactstrap";
import Loader from "react-loader";
import {
  FaBirthdayCake,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck
} from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

class UserCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popover: false,
      modal: false,
      loading: true,
      newRole: ""
    };
  }
  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

  onChangeRole = () => {
    console.log("onChangeRole");
    this.getUserRole();
    this.setState({
      modal: !this.state.modal
    });
  };

  getUserRole = () => {
    let { user } = this.props;
    if (this.props.role.includes("Admin")) {
      fetch(
        "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/" +
          user.username,
        {
          method: "GET",

          headers: {
            Authorization: this.props.token
          }
        }
      )
        .then(res => res.json())
        .then(res =>
          this.setState({
            oldRole: res,
            roles: res,
            loading: false
          })
        );
    }
  };

  changeUserRole = () => {
    let user = this.props.user;
    if (this.props.role.includes("Admin")) {
      fetch(
        "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/" +
          user.username,
        {
          method: "PUT",

          headers: {
            Authorization: this.props.token
          },

          body: JSON.stringify({
            oldRole: this.state.oldRole[0],
            newRole: this.state.roles[0]
          })
        }
      )
        .then(res => res.text())
        .then(() => {
          this.setState({
            oldRole: this.state.roles
          });
        });
    }
  };

  render() {
    const { user } = this.props;

    console.log(this.state.roles);
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.modal}
          toggle={this.onChangeRole}
          target={"edit-" + user.username}
        >
          <ModalHeader>
            {" "}
            <b>Changing role of {user.username}</b>
          </ModalHeader>
          <ModalBody>
            {this.state.loading && <Loader loaded={!this.state.loading} />}

            {!this.state.loading && (
              <FormGroup style={{ margin: "5px auto" }}>
                <Select
                  name="assignees"
                  onChange={this.handleRoleChange}
                  placeholder={"Please select new role for " + user.username}
                  components={makeAnimated()}
                  value={(this.state.roles || []).map(r => ({
                    value: r,
                    label: r
                  }))}
                  options={["Admin", "Developer", "ProjectManager"].map(r => ({
                    label: r,
                    value: r
                  }))}
                />
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              size="l"
              className="mt-3 mb-3 mr-2"
              onClick={this.onChangeRole}
            >
              <FaTimes /> Cancel
            </Button>
            <Button
              color="success"
              size="l"
              className="mt-3 mb-3 ml-2"
              onClick={this.changeUserRole}
            >
              Confirm <FaCheck />
            </Button>
          </ModalFooter>
        </Modal>

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
              <a href={"mailto:" + user.email}>
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
                </Button>{" "}
              </a>
              <Button
                id={"edit-" + user.username}
                color="link"
                size="lg"
                style={{ color: "black" }}
                className="p-1 mt-0"
                onClick={this.onChangeRole}
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
                    You will not be able to recover {user.username}. Are you
                    sure you want to delete them? <br />
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
      </React.Fragment>
    );
  }

  removeUser = () => {
    this.props.deleteUser(this.props.project);
  };
  handleRoleChange = e => {
    this.setState({ roles: [e.value] });
  };
}

export default UserCard;
