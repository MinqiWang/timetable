import React, { Component } from 'react'
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserImage from './UserImage';
import Image from 'react-bootstrap/Image'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import Dropdown from 'react-bootstrap/Dropdown'
import UserMenu from './UserMenu';
import logo from '../../logo.svg';
import { logOut, setDisplay, setUser, setWatching } from '../../redux/actions'
import { getUser, getWatching } from '../../redux/selecter';
import {logout} from '../../RESTFul/ajax'



/* This is the component responsible for Main Nav like User Home, Info, Control SignIn/Out UX (not Display Nav)*/
export class Header extends Component {

  itemSelectionHandler(key, e) {
    switch (key) {
      case "1":
        return console.log("do userinfo")
      case "2":
        logout(this.props.logOut);
        return
      default:
        return alert("I do not know what you want me to do")
    }
  }

  componentDidMount() {
  }

  render() {
    const {User, Watching} = this.props;
    let nav = User? (<>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link onClick={() => {this.props.setWatching(); this.props.setDisplay("Timetable");}}>Timetable</Nav.Link>
        <Nav.Link onClick={() => this.props.setDisplay("Map")}>Map</Nav.Link>
        <Nav.Link onClick={() => this.props.setDisplay("Search")}>Search</Nav.Link>
        <Dropdown onSelect={(key, e) => this.itemSelectionHandler(key, e)}>
          <Dropdown.Toggle alignright as={UserImage} id="dropdown-custom-components">
            Custom toggle
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-right" as={UserMenu}>
            <Dropdown.Item eventKey="1" active>User Info</Dropdown.Item>
            <Dropdown.Item eventKey="2">Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        {Watching?
        <> 
        <Nav.Item>Watching</Nav.Item>
        <OverlayTrigger
            key='left'
            placement='left'
            overlay={
                <Tooltip id={`usertooltip-left`}>
                    {Watching.name}
                    {/* should be the signin Name 
                    from state, and use username in cookie to set the state */}
                </Tooltip>
            }
        >
            <Image src={Watching.avatarURL} roundedCircle width="70px" height="70px"/>
        </OverlayTrigger>
        </>
        : null}
        
      </Nav>
    </Navbar.Collapse>
    </>) : null;
    return (
      <>
        <Navbar bg="light" expand="sm">
            <Navbar.Brand href="#home">
              <img
              alt=""
              src={logo}
              width="48"
              height="48"
              className="d-inline-block align-top"
              />
              {' Go? Go!'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
                  {nav}
                  {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                      <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown> */}
                
        </Navbar>
      </>
    )
  }
}

const mapStateToProps = state => {
  console.log("Header");
  console.log(state);
  const User = getUser(state);
  const Watching = getWatching(state);
  console.log(User);
  return { User, Watching };
};

export default connect(mapStateToProps, { logOut, setDisplay, setUser, setWatching })(Header);
