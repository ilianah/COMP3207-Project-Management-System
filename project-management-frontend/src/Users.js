import React, { Component, Fragment } from "react";
import MNavbar from "./MNavbar";
import UserCard from "./UserCard";
import { Row } from "reactstrap";
import Loader from "react-loader";

export default class Users extends Component {
  state = {
    users: [],
    loading: true
  };

  componentDidMount() {
    fetch("https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/users/", {
      method: "GET",
      headers: {
        Authorization: this.props.token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          users: res,
          loading:false
        });
      });

  }

  render() {
    let username = this.props.username;
    let role = this.props.role;
    const users = this.state.users;

    return (
      <Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background">
          {this.state.loading && <Loader loaded={!this.state.loading} />}

          {!this.state.loading && (
            <Row>
              {users.map(u => (
                <UserCard user={u} key={u.username} />
              ))}
            </Row>
          )}
        </div>
      </Fragment>
    );
  }
}
