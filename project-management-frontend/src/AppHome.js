import React, { Component, Fragment } from "react";
import AppNavbar from "./AppNavbar";

export default class AppHome extends Component {
  render() {
    const { role, username } = this.props;

    return (
      <Fragment>
        <AppNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background">
          <div className="header" />
          <div className="quote">
            Insightful quote this is Insightful quote this is Insightful quote
            this is Insightful quote this is Insightful quote this is{" "}
          </div>
        </div>
      </Fragment>
    );
  }
}
