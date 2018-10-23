import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {CognitoAuth} from 'amazon-cognito-auth-js';

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
        console.log(result.idToken.jwtToken);
        this.setState({loggedIn: true, username: this.auth.username});
      },
    
      onFailure: err => {
        this.setState({loggedIn: false, username: undefined});
      }
    }

    if(this.auth.getCachedSession().isValid()) {
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
                <button onClick={this.logout}>Logout</button>  
              </div>
              :
              <div>
                You are not logged in. 
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
}

export default App;
