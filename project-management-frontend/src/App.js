import React, { Component } from 'react';
import './App.css';
import { CognitoAuth } from 'amazon-cognito-auth-js';

class App extends Component {
  state = {}

  componentDidMount() {
    let authData = {
      ClientId: '2pk41ten9ocjpluelle01hiral',
      AppWebDomain: 'projectmanagement.auth.us-east-1.amazoncognito.com',
      TokenScopesArray: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      RedirectUriSignIn: 'http://localhost:3000',
      RedirectUriSignOut: 'http://localhost:3000'
    }

    this.auth = new CognitoAuth(authData);

    this.auth.userhandler = {
      onSuccess: result => {
        this.setState({ loggedIn: true, username: this.auth.username, token: result.idToken.jwtToken });
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
      <div className="App">
        <header className="App-header">
          <div>
            {this.state.loggedIn ?
              <div>
                You are logged in as {this.state.username}
                <button onClick={this.testget}>Do GET Request</button>
                <button onClick={this.testdelete}>Do DELETE Request</button>
                <button onClick={this.testupdate}>Do UPDATE Request</button>
                <button onClick={this.testcreate}>Do CREATE Request</button>

                <button onClick={this.logout}>Logout</button>
              </div>
              :
              <div>
                You are not logged in.
                <button onClick={this.testget}>Do GET Request</button>
                <button onClick={this.testdelete}>Do DELETE Request</button>
                <button onClick={this.testupdate}>Do UPDATE Request</button>
                <button onClick={this.testcreate}>Do CREATE Request</button>
                <button onClick={this.login}>Login</button>
              </div>}
          </div>
        </header>
      </div>
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
        { "name": "My second project", "description": "My second description", "status": "New", "owner": "lushi", "assignees": ["Misho"] }
      ), headers: {
        Authorization: this.state.token
      }
    }).then(res => res.json()).then(res => {
      this.setState({lastId: res.id})
      console.log(res);
    })
  }

  testupdate = () => {
    fetch('https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/projects/', {
      method: 'PUT', body: JSON.stringify(
        { "id": this.state.lastId, "name": "My second project", "description": "My second description", "status": "New", "assignees": ["Misho", "Hari", "Lushi"], owner: "lushi"}
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
