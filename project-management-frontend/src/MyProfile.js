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
import { getUsers, getSkills, updateProfile } from "./util/requests";
import MyProfileModal from "./user/MyProfileModal";

class MyProfile extends React.Component {
  state = {
    user: [],
    skills: "",
    picture: "",
    userloading: true,
    skillsloading: true,
    modal: false
  };

  componentDidMount = () => {
    getUsers(this.props.token).then(res => {
      this.setState({
        user: res.filter(u => u.username === this.props.username),
        userloading: false,
        picture: res.filter(u => u.username === this.props.username)[0].picture
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

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onUpdateProfile = () => {
    updateProfile(
      this.props.token,
      this.props.username,
      this.state.skillsTemp,
      this.state.picture,
      this.state.user[0].birthdate
    ).then(() =>
      this.setState({
        skills: this.state.skillsTemp,
        picture: this.state.picture,
        user: {
          ...this.state.user,
          picture: this.state.picture
        }
      })
    );

    this.toggleModal();
  };

  handleCreate = inputValue => {
    let skills = inputValue.map(s => s.value).join(",");
    this.setState({ skillsTemp: skills });
  };

  handleUpdateUserPhoto = e => {
    this.setState({
      picture: e.target.value
    });
  };

  render() {
    const { role, username } = this.props;
    let user = this.state.user[0];
    let hasSkills = this.state.skills !== "";

    console.log(this.state.picture);
    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background ">
          <div className="header" />

          <Loader
            loaded={!(this.state.userloading || this.state.skillsloading)}
          />

          {!this.state.userloading && !this.state.skillsloading && (
            <Col className="text-center" md={{ size: 4, offset: 4 }} sm="12">
              <MyProfileModal
                modal={this.state.modal}
                onUpdateProfile={this.onUpdateProfile}
                handleCreate={this.handleCreate}
                toggleModal={this.toggleModal}
                loading={this.state.loading}
                picture={this.state.picture}
                handleUpdateUserPhoto={this.handleUpdateUserPhoto}
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
                    src={this.state.picture}
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
                    onClick={this.toggleModal}
                  >
                    <FaEdit />
                    <UncontrolledTooltip
                      placement="top"
                      target={"edit-" + username}
                    >
                      Update Profile
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
