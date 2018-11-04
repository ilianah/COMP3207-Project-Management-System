import React from "react";
import { CognitoAuth } from "amazon-cognito-auth-js";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Splash from "./Splash";
import Home from "./Home";
import ProjectsList from "./ProjectsList";
import Users from "./Users";
import CreateProject from "./CreateProject";
import MyProfile from "./MyProfile";

const authData = {
  ClientId: "1nc0sof19hqvahp196dgc7g0bc",
  AppWebDomain: "projectmanagement.auth.us-east-1.amazoncognito.com",
  TokenScopesArray: [
    "phone",
    "email",
    "openid",
    "aws.cognito.signin.user.admin",
    "profile"
  ],
  RedirectUriSignIn: "http://localhost:3000",
  RedirectUriSignOut: "http://localhost:3000"
};

class App extends React.Component {
  state = {};
  auth = new CognitoAuth(authData);

  componentDidMount() {
    this.auth.userhandler = {
      onSuccess: result => {
        let role = this.auth.getCachedSession().accessToken.payload[
          "cognito:groups"
        ];

        let username = this.auth.username;
        this.setState({ token: result.idToken.jwtToken, role, username });
      },

      onFailure: err => {
        this.setState({
          loggedIn: false,
          role: undefined,
          username: undefined
        });
      }
    };

    if (this.auth.getCachedSession().isValid()) {
      this.auth.userhandler.onSuccess(this.auth.getCachedSession());
    }

    let curUrl = window.location.href;
    this.auth.parseCognitoWebResponse(curUrl);
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
                if (this.auth.isUserSignedIn()) {
                  return <Redirect to="/home" />;
                }
                return (
                  <Splash
                    {...props}
                    doLogin={this.login}
                    doSignup={this.signup}
                  />
                );
              }}
            />

            <Route
              path="/home"
              exact
              render={props => {
                return (
                  <Home {...this.state} {...props} doLogout={this.logout} />
                );
              }}
            />

            <Route
              path="/projects"
              exact
              render={props => {
                if (this.auth.isUserSignedIn() && this.state.token)
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
                if (this.auth.isUserSignedIn() && this.state.token)
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
                if (this.auth.isUserSignedIn() && this.state.token)
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
                if (this.auth.isUserSignedIn() && this.state.token)
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
              path="/projects/update/:id"
              render={props => {
                if (this.auth.isUserSignedIn() && this.state.token)
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
          </Switch>
        </div>
      </Router>
    );
  }

  login = () => {
    this.auth.getSession();
  };

  logout = () => {
    this.auth.signOut();
  };

  signup = () => {
    window.location =
      "https://projectmanagement.auth.us-east-1.amazoncognito.com/signup?redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&client_id=1nc0sof19hqvahp196dgc7g0bc&state=XT66S2tjWJaMq7STToBTdrg9C496Q1pj&scope=phone%20email%20openid%20aws.cognito.signin.user.admin%20profile";
  };
}

export default App;
