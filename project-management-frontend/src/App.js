import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./Login";
import Splash from "./Splash";
import Home from "./Home";
import ProjectsList from "./ProjectsList";
import Users from "./Users";
import CreateProject from "./CreateProject";
import MyProfile from "./MyProfile";
import { CognitoUserPool } from "amazon-cognito-identity-js";

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
                if (!this.state.loggingIn && !this.state.loggedIn)
                  return <Redirect to="/" />;
                if (this.state.loggedIn && this.state.token)
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
                return <Login login={this.login} {...props} />;
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
    window.location = encodeURI(
      `https://projectmanagement.auth.us-east-1.amazoncognito.com/signup?redirect_uri=${
        process.env.REACT_APP_REDIRECT_URI
      }&response_type=token&client_id=${
        process.env.REACT_APP_CLIENT_ID
      }&scope=phone email openid aws.cognito.signin.user.admin profile`
    );
  };

  login = session => {
    console.log(session);
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
