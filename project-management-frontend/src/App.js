import React, { Component } from 'react';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import AppSplash from './AppSplash';
import AppHome from './AppHome';

const authData = {
  ClientId: '2pk41ten9ocjpluelle01hiral',
  AppWebDomain: 'projectmanagement.auth.us-east-1.amazoncognito.com',
  TokenScopesArray: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
  RedirectUriSignIn: 'http://localhost:3000',
  RedirectUriSignOut: 'http://localhost:3000'
}

class App extends Component {
  state = {}
  auth = new CognitoAuth(authData);

  componentDidMount() {


    this.auth.userhandler = {
      onSuccess: result => {
        this.setState({ token: result.idToken.jwtToken });
      },

      onFailure: err => {
        this.setState({ loggedIn: false, username: undefined });
      }
    }

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
          <Route path="/" exact render={props => {
            console.log(this.auth);
            if (this.auth.isUserSignedIn()) {
              return <Redirect to="/home" />
            }
            return <AppSplash {...props} doLogin={this.login} />
          }} />

          <Route path="/home" exact render={props => {
            return <AppHome auth={this.auth} {...this.state} {...props}/>
          }} />
        </div>
      </Router>
    );
  }

  login = () => {
    this.auth.getSession();
  }

  logout = () => {
    this.auth.signOut();
  }

  testget = () => {
    fetch('https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/', {
      method: 'GET', headers: {
        Authorization: this.state.token
      }
    }).then(res => res.json()).then(console.log)
  }

  testcreate = () => {
    fetch('https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/', {
      method: 'POST', body: JSON.stringify(
        { "name": "My second project", "description": "My second description", "status": "New", "owner": "projmanager", "assignees": ["Misho"] }
      ), headers: {
        Authorization: this.state.token
      }
    }).then(res => res.json()).then(res => {
      this.setState({ lastId: res.id })
      console.log(res);
    })
  }

  testupdate = () => {
    fetch('https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/', {
      method: 'PUT', body: JSON.stringify(
        { "id": this.state.lastId, "name": "My second project", "description": "My second description", "status": "New", "assignees": ["Misho", "Hari", "Lushi"], owner: "projmanager" }
      ), headers: {
        Authorization: this.state.token
      }
    }).then(res => res.json()).then(res => console.log(res))

  }

  testdelete = () => {
    fetch('https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/' + this.state.lastId, {
      method: 'DELETE',
      headers: {
        Authorization: this.state.token
      }
    }).then(res => res.text()).then(res => console.log(res))
  }
}

export default App;
