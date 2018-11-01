import React, { Component } from "react";
import { CognitoAuth } from "amazon-cognito-auth-js";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Splash from "./Splash";
import Home from "./Home";
import ProjectsList from "./ProjectsList";
import Users from "./Users";
import CreateProject from "./CreateProject";

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

class App extends Component {
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
          <Route
            path="/"
            exact
            render={props => {
              if (this.auth.isUserSignedIn()) {
                return <Redirect to="/home" />;
              }
              return <Splash {...props} doLogin={this.login} />;
            }}
          />

          <Route
            path="/home"
            exact
            render={props => {
              return <Home {...this.state} {...props} doLogout={this.logout} />;
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
              return <Redirect to="/" />;
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
              return <Redirect to="/" />;
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
              return <Redirect to="/" />;
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
              return <Redirect to="/" />;
            }}
          />

          <Route
            path="**"
            render={props => {
              return <Redirect to="/" />;
            }}
          />
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
}

export default App;
