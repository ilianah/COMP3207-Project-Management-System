import React, { Component, Fragment } from "react";
import MNavbar from "./MNavbar";

export default class Users extends Component {
  render() {
    let username = this.props.username;
    let role = this.props.role;

    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background" />
      </Fragment>
    );
  }
}
