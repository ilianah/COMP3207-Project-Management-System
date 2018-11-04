import React, { Fragment } from "react";
import {
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  UncontrolledTooltip
} from "reactstrap";
import Loader from "react-loader";
import {
  FaBirthdayCake,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSitemap,
  FaLightbulb
} from "react-icons/fa";
import MNavbar from "./MNavbar";
import { getUsers, getSkills, updateProfile } from "./requests";
import MyProfileModal from "./user/MyProfileModal";

class MyProfile extends React.Component {
  state = {
    user: [],
    skills: "",
    userloading: true,
    skillsloading: true,
    modal: false
  };

  componentDidMount = () => {
    getUsers(this.props.token).then(res => {
      this.setState({
        user: res.filter(u => u.username === this.props.username),
        userloading: false
      });
    });

    getSkills(this.props.token, this.props.username).then(res => {
      this.setState({
        skills: res.skills,
        skillsTemp: res.skills,
        skillsloading: false
      });
    });
  };

  onClickEdit = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onUpdateProfile = () => {
    updateProfile(
      this.props.token,
      this.props.username,
      this.state.skillsTemp,
      this.state.user[0].birthdate
    ).then(() =>
      this.setState({
        skills: this.state.skillsTemp
      })
    );
  };

  handleCreate = inputValue => {
    let skills = inputValue.map(s => s.value).join(",");
    this.setState({ skillsTemp: skills });
  };

  render() {
    const { role, username } = this.props;
    let user = this.state.user[0];
    let hasSkills = this.state.skills !== "";

    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <div className="header" />

          {(this.state.userloading || this.state.skillsloading) && (
            <Loader loaded={!this.state.loading} />
          )}

          {!this.state.userloading &&
            !this.state.skillsloading && (
              <Col className="text-center" md={{ size: 4, offset: 4 }} sm="12">
                <MyProfileModal
                  username={username}
                  modal={this.state.modal}
                  onUpdateProfile={this.onUpdateProfile}
                  handleCreate={this.handleCreate}
                  onClickEdit={this.onClickEdit}
                  loading={this.state.loading}
                  birthdate={user.birthdate}
                  skills={this.state.skillsTemp}
                />
                <Card
                  className="mt-3 ml-3 mr-3 mb-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                >
                  <CardHeader className="text-center">
                    <h3>{user.name}</h3>
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
                      <FaSitemap /> {role}
                    </h5>
                    <h5>
                      <FaLightbulb />
                      {!hasSkills && <i>You have no added skills</i>}
                      {hasSkills && this.state.skills}
                    </h5>
                    <h5>
                      <FaEnvelope /> {user.email}
                    </h5>
                    <h5>
                      <FaBirthdayCake /> {user.birthdate}
                    </h5>
                  </CardBody>
                  <CardFooter>
                    <Button
                      id={"edit-" + username}
                      color="link"
                      size="lg"
                      style={{ color: "black" }}
                      className="p-1 mt-0"
                      onClick={this.onClickEdit}
                    >
                      <FaEdit />
                      <UncontrolledTooltip
                        placement="top"
                        target={"edit-" + username}
                      >
                        Update Skills
                      </UncontrolledTooltip>
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            )}
        </div>
      </Fragment>
    );
  }

  removeUser = () => {
    this.props.deleteUser(this.props.project);
  };
  handleRoleChange = e => {
    this.setState({ roles: [e.value] });
  };
}

export default MyProfile;
