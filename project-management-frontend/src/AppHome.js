import React, { Component, Fragment } from 'react';
import AppNavbar from './AppNavbar';

export default class AppHome extends Component {

    render() {
        let role = this.props.auth
            .signInUserSession.accessToken.payload['cognito:groups'];
        let username = this.props.auth.username;

        return (
            <Fragment>
                <AppNavbar doLogout={() => this.props.auth.signOut()} role={role} username ={username}/>
                You are logged in as {this.props.auth.username} {role}
            </Fragment>
        )
    }
}