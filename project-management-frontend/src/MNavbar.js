import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Navbar,
  NavItem,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Nav,
  Collapse,
  NavbarToggler
} from "reactstrap";
import { FaUser } from "react-icons/fa";

class MNavbar extends React.Component {
  state = { isOpen: false };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { doLogout, role, username } = this.props;

    return (
      <div>
        <Navbar light expand="md" style={{ backgroundColor: "white" }}>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/projects">
                  Projects
                </NavLink>
              </NavItem>
              {role && role.includes("Admin") && (
                <NavItem>
                  <NavLink className="nav-link" to="/users">
                    Users
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <FaUser /> {username}
                </DropdownToggle>
                <DropdownMenu right>
                  <Link to={"/users/" + username}>
                    <DropdownItem to={`/ ${username}`}>My Profile</DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <Link onClick={doLogout} to="/">
                    <DropdownItem>Logout</DropdownItem>
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MNavbar;
