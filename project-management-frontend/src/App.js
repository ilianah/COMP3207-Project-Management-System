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

/**
 * Dealing with routing - matches the path parameters and redirects to a specific component
 * upon specifying a specific path
 * When redirecting to pages it is checked whether a user is logged in, so that unauthenticated users
 * are not allowed access to resources within the application;
 * Non-existing pages are also handled by redirecting to the home page if a specific url doesn't exist
 */
class App extends React.Component {
  state = { loggingIn: true, loggedIn: false };

  // Initialise the user pool and get the current user
  componentDidMount() {
    let poolData = {
      UserPoolId: "us-east-1_p4KcysLln",
      ClientId: process.env.REACT_APP_CLIENT_ID
    };
    this.userPool = new CognitoUserPool(poolData);
    let cognitoUser = this.userPool.getCurrentUser();

    // If the user exists, the session is valid and the user is logged in
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
                    (this.state.token && !this.state.role.includes("Admin")))
                )
                  return <Redirect to="/" />;
                if (
                  this.state.loggedIn &&
                  this.state.token &&
                  this.state.role.includes("Admin")
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
                if (
                  !this.state.loggingIn &&
                  (!this.state.loggedIn ||
                    (this.state.token &&
                      (!this.state.role.includes("Admin") &&
                        !this.state.role.includes("ProjectManager"))))
                )
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
                if (this.state.loggedIn && this.state.token)
                  return <Redirect to="/" />;
                return <VerificationCode {...props} />;
              }}
            />
            <Route
              path="/projects/update/:id"
              render={props => {
                if (
                  !this.state.loggingIn &&
                  (!this.state.loggedIn ||
                    (this.state.token &&
                      (!this.state.role.includes("Admin") &&
                        !this.state.role.includes("ProjectManager"))))
                )
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

  // Signing out of the application and setting the token to null, so that there is no access to other pages
  logout = () => {
    this.userPool.getCurrentUser().signOut();
    this.setState({ loggedIn: false, token: null });
  };

  // Redirect to the signup page
  signup = () => {
    window.location = "/signup";
  };

  /**
   * Set the state of the application to keep the information of the current user logged in;
   * this will be used to give access to other pages in the application, which are not accessible
   * otherwise
   */
  login = session => {
    this.setState(
      {
        token: session.idToken.jwtToken,
        role: session.idToken.payload["cognito:groups"],
        username: session.idToken.payload["cognito:username"],
        loggingIn: false,
        loggedIn: true
      },
      () => {
        console.log(this.state);
      }
    );
  };
}

export default App;
