import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { FaArrowRight, FaTimes, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js";
import Loader from "react-loader";

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };
  render() {
    let LoginButton = () => (
      <Button
        color="success"
        size="l"
        onClick={this.login}
        className="mt-3 mb-3 ml-2"
        disabled={this.state.loggingIn}
      >
        {!this.state.loggingIn ? (
          <span>
            Log In <FaArrowRight />
          </span>
        ) : (
          <span>
            Logging you in... <FaSpinner />{" "}
          </span>
        )}
      </Button>
    );

    let CancelButton = () => (
      <Link to="/">
        <Button color="danger" size="l" className="mt-3 mb-3 mr-2">
          <FaTimes /> Cancel
        </Button>
      </Link>
    );

    return (
      <div className="background ">
        <div className="header" />
        <div className="form-box">
          <Form style={{ width: "100%" }}>
            <FormGroup style={{ width: "30%", margin: "5px auto" }}>
              <Label for="name">
                <b>Username</b>
              </Label>
              <Input
                type="text"
                onChange={this.handleUsernameInput}
                name="name"
              />
              <FormFeedback invalid="false" />
            </FormGroup>
            <FormGroup style={{ width: "30%", margin: "5px auto" }}>
              <Label for="description">
                <b>Password</b>
              </Label>
              <Input type="password" onChange={this.handlePasswordInput} />
              <FormFeedback invalid="true" />
            </FormGroup>
            <br />
            <div>
              <CancelButton />
              <LoginButton />
            </div>
          </Form>
        </div>
      </div>
    );
  }

  handleUsernameInput = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordInput = e => {
    this.setState({
      password: e.target.value
    });
  };

  login = () => {
    let authData = {
      Username: this.state.username,
      Password: this.state.password
    };
    let authDetails = new AuthenticationDetails(authData);

    const poolData = {
      UserPoolId: "us-east-1_p4KcysLln",
      ClientId: process.env.REACT_APP_CLIENT_ID
    };

    let userPool = new CognitoUserPool(poolData);

    let userData = {
      Username: this.state.username,
      Pool: userPool
    };

    let cognitoUser = new CognitoUser(userData);

    this.setState({ loggingIn: true });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: res => {
        this.setState({ loggingIn: false });
        if (res) {
          this.props.login(res);
          this.props.history.replace("/home");
        }
      },
      onFailure: err => {
        this.setState({ loggingIn: false, error: err });
        console.log(err);
        console.log(err.message || JSON.stringify(err));
      }
    });
  };
}
export default Login;
