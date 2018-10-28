import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavItem, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Nav, Collapse, NavbarToggler } from 'reactstrap';
import { FaUser } from 'react-icons/fa'

class AppNavbar extends React.Component {
    state = { isOpen: false };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        const { doLogout, role, username } = this.props;
    
        return (
            <div>
                <Navbar color="transparent" light expand="md">
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/projects" >Projects</NavLink>
                            </NavItem>
                            {role && role.includes('Admin') &&
                                <NavItem>
                                    <NavLink className="nav-link" to="/users">Users</NavLink>
                                </NavItem>
                            }
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar className="m-auto">
                            <form className="form-inline">
                                <input className="form-control mr-sm-2" type="search" placeholder="Search Project/User..." aria-label="Search" />
                                <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
                            </form>
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    <FaUser/> {username}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem to={`/ ${username}`}>My Profile</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        <NavLink className="nav-link" onClick={doLogout} to="/">Logout</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
};

export default AppNavbar;