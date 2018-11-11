import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Splash from "./Splash";
import Home from "./Home";
import ProjectsList from "./ProjectsList";
import Users from "./Users";
import CreateProject from "./CreateProject";
import MyProfile from "./MyProfile";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import VerificationCode from "./VerificationCode";

class App extends React.Component {
  state = { loggingIn: true, loggedIn: false };

  componentDidMount() {
    let poolData = {
      UserPoolId: "us-east-1_p4KcysLln",
      ClientId: process.env.REACT_APP_CLIENT_ID
    };
    this.userPool = new CognitoUserPool(poolData);
    let cognitoUser = this.userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (session && session.isValid()) this.login(session);
      });
    }

    setTimeout(() => {
      if (!this.state.loggedIn) {
        this.setState({ loggingIn: false });
      }
    }, 100);
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              path="/"
              exact
              render={props => {
                if (this.state.loggedIn) {
                  return <Redirect to="/home" />;
                }
                return <Splash {...props} doSignup={this.signup} />;
              }}
            />
            <Route
              path="/home"
              exact
              render={props => {
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                return (
                  <Home {...this.state} {...props} doLogout={this.logout} />
                );
              }}
            />
            <Route
              path="/projects"
              exact
              render={props => {
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                if (this.state.loggedIn && this.state.token)
                  return (
                    <ProjectsList
                      {...this.state}
                      {...props}
                      doLogout={this.logout}
                    />
                  );
                return null;
              }}
            />
            <Route
              path="/users"
              exact
              render={props => {
                if (
                  !this.state.loggingIn &&
                  (!this.state.loggedIn ||
                    (this.state.token && this.state.role !== "Admin"))
                )
                  return <Redirect to="/" />;
                if (
                  this.state.loggedIn &&
                  this.state.token &&
                  this.state.role === "Admin"
                )
                  return (
                    <Users {...this.state} {...props} doLogout={this.logout} />
                  );
                return null;
              }}
            />
            <Route
              path="/users/:username?"
              exact
              render={props => {
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                if (this.state.loggedIn && this.state.token)
                  return (
                    <MyProfile
                      {...this.state}
                      {...props}
                      doLogout={this.logout}
                    />
                  );
                return null;
              }}
            />
            <Route
              path="/projects/create/:status?"
              render={props => {
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                if (this.state.loggedIn && this.state.token)
                  return (
                    <CreateProject
                      {...this.state}
                      {...props}
                      doLogout={this.logout}
                    />
                  );
                return null;
              }}
            />
            <Route
              path="/login"
              exact
              render={props => {
                if (this.state.loggedIn && this.state.token)
                  return <Redirect to="/" />;
                return <Login login={this.login} {...props} />;
              }}
            />
            <Route
              path="/signup"
              exact
              render={props => {
                if (this.state.loggedIn && this.state.token)
                  return <Redirect to="/" />;
                return <SignUp signup={this.signup} {...props} />;
              }}
            />
            <Route
              path="/code"
              exact
              render={props => {
                return <VerificationCode {...props} />;
              }}
            />
            <Route
              path="/projects/update/:id"
              render={props => {
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                if (this.state.loggedIn && this.state.token)
                  return (
                    <CreateProject
                      {...this.state}
                      {...props}
                      doLogout={this.logout}
                    />
                  );
                return null;
              }}
            />
            {
              <Route
                render={props => {
                  return <Redirect to="/" />;
                }}
              />
            }
            />
          </Switch>
        </div>
      </Router>
    );
  }

  logout = () => {
    this.userPool.getCurrentUser().signOut();
    this.setState({ loggedIn: false, token: null });
  };

  signup = () => {
    window.location = "/signup";
  };

  login = session => {
    this.setState({
      token: session.idToken.jwtToken,
      role: session.idToken.payload["cognito:groups"],
      username: session.idToken.payload["cognito:username"],
      loggingIn: false,
      loggedIn: true
    });
  };
}

export default App;
