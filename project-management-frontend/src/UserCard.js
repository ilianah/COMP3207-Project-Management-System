import React from "react";
import { Col, Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import {
  FaBirthdayCake,
  FaUser,
  FaEnvelope,
  FaLightbulb,
  FaSitemap
} from "react-icons/fa";
import { getUser, updateRole } from "./util/requests";
import UserCardModal from "./user/UserCardModal";
import UserCardEmailButton from "./user/UserCardEmailButton";
import UserCardChangeRoleButton from "./user/UserCardChangeRoleButton";
import UserCardDeleteButton from "./user/UserCardDeleteButton";

/**
 * User card that displays all user attributes in a user card
 * Provides the functionality of deleting a user; editing user role and
 * sending an email to a specific user; The state holds information about the modal
 * used for updating user role, as well as the new role assigned to a user;
 * The component maintains the data about the old and then new role for a user in order to
 * show live updates
 */
class UserCard extends React.Component {
  state = {
    popover: false,
    modal: false,
    loading: true,
    newRole: ""
  };

  // Toggle popovers
  onPopover = () => {
    this.setState({ popover: !this.state.popover });
  };

  // Toggle modal
  onChangeRole = () => {
    this.getUserRole();
    this.setState({
      modal: !this.state.modal
    });
  };

  // Retrieve the user role from Cognito via a GET API request and update the component state
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

  // Send a POST request to update a user attribute; this can only be done if the currently logged in user is an admin and update the state
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

    // Does a user have skills
    let hasSkills = typeof user.skills === "string";

    // Regex for search highlighting
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

  // API request to delete a user
  removeUser = () => {
    this.props.deleteUser(this.props.project);
  };

  // Update the component state when a user role is changed
  handleRoleChange = e => {
    this.setState({ roles: [e.value] });
  };
}

export default UserCard;
