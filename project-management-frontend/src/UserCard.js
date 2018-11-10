import React from "react";
import { Col, Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import {
  FaBirthdayCake,
  FaUser,
  FaEnvelope,
  FaLightbulb,
  FaSitemap
} from "react-icons/fa";
import { getUser, updateRole } from "./requests";
import UserCardModal from "./user/UserCardModal";
import UserCardEmailButton from "./user/UserCardEmailButton";
import UserCardChangeRoleButton from "./user/UserCardChangeRoleButton";
import UserCardDeleteButton from "./user/UserCardDeleteButton";

class UserCard extends React.Component {
  state = {
    popover: false,
    modal: false,
    loading: true,
    newRole: ""
  };

  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

  onChangeRole = () => {
    this.getUserRole();
    this.setState({
      modal: !this.state.modal
    });
  };

  getUserRole = () => {
    let { user } = this.props;
    if (this.props.role.includes("Admin")) {
      getUser(this.props.token, user.username).then(res =>
        this.setState({
          oldRole: res,
          roles: res,
          loading: false
        })
      );
    }
  };

  changeUserRole = () => {
    this.onChangeRole();
    let user = this.props.user;
    if (this.props.role.includes("Admin")) {
      updateRole(
        this.props.token,
        user.username,
        this.state.oldRole[0],
        this.state.roles[0]
      ).then(() => {
        this.setState({
          oldRole: this.state.roles
        });
        this.getUserRole();
      });
    }
  };

  render() {
    const { user } = this.props;
    let hasSkills = typeof user.skills === "string";

    let regex = new RegExp("(" + this.props.filter + ")", "i");

    return (
      <React.Fragment>
        <UserCardModal
          username={user.username}
          modal={this.state.modal}
          onChangeRole={this.onChangeRole}
          changeUserRole={this.changeUserRole}
          handleRoleChange={this.handleRoleChange}
          loading={this.state.loading}
          roles={this.state.roles}
        />

        <Col sm="4" className="text-center">
          <Card
            className="mt-3 ml-3 mr-3 mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <CardHeader className="text-center">
              <h3
                dangerouslySetInnerHTML={{
                  __html: user.name.replace(regex, "<mark>$1</mark>")
                }}
              />
            </CardHeader>
            <CardBody>
              <img
                src={user.picture}
                alt="avatar"
                className="rounded-circle"
                width="120"
                height="120"
              />
              <h5>
                <FaUser /> {user.username}
              </h5>
              <h5>
                <FaSitemap /> {this.state.oldRole || user.group}
              </h5>
              <h5>
                <FaLightbulb />
                {!hasSkills && <i> {user.username} has no added skills</i>}
                {hasSkills && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: user.skills.replace(regex, "<mark>$1</mark>")
                    }}
                  />
                )}
              </h5>
              <h5>
                <FaEnvelope /> {user.email}
              </h5>
              <h5>
                <FaBirthdayCake /> {user.birthdate}
              </h5>
            </CardBody>
            <CardFooter>
              <UserCardEmailButton user={user} />
              <UserCardChangeRoleButton
                user={user}
                onChangeRole={this.onChangeRole}
              />
              <UserCardDeleteButton
                user={user}
                onPopover={this.onPopover}
                removeUser={this.removeUser}
                popover={this.state.popover}
              />
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
