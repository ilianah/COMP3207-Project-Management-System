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
import LoginErrorModal from "./auth/login/LoginErrorModal";

/**
 * Custom Login Page that holds information for the username and password and makes use of amazon-cognito-identity-js
 * to authenticate a user and log them in; A modal is shown in case there is an error with logging in
 */
class Login extends React.Component {
  state = {
    username: "",
    password: "",
    modal: false
  };
  render() {
    let LoginButton = () => (
      <Button
        type="submit"
        id="login"
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
        {this.state.error && (
          <LoginErrorModal
            error={this.state.error}
            modal={this.state.modal}
            onError={this.onError}
          />
        )}
      </Button>
    );

    let CancelButton = () => (
      <Link to="/">
        <Button
          type="button"
          color="danger"
          size="l"
          className="mt-3 mb-3 mr-2"
        >
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
                username="name"
                valid={this.isValidInput(this.state.username)}
              />
            </FormGroup>
            <FormGroup style={{ width: "30%", margin: "5px auto" }}>
              <Label for="description">
                <b>Password</b>
              </Label>
              <Input
                type="password"
                onChange={this.handlePasswordInput}
                valid={this.isValidInput(this.state.password)}
              />
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

  /**
   * Handlers for username and password input
   */
  handleUsernameInput = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordInput = e => {
    this.setState({
      password: e.target.value
    });
  };

  // Trigger the modal in case of an error
  onError = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Check for valid input
  isValidInput = input => {
    return input.length > 0;
  };

  // Use Cognito and the user's input to authenticate the user
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
      // Trigger the modal if there is an error
      onFailure: err => {
        this.setState({ loggingIn: false, error: err, modal: true });
      }
    });
  };
}
export default Login;
