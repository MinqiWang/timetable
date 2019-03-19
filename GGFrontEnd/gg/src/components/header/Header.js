import React, { Component } from 'react'
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserImage from './UserImage';
import Dropdown from 'react-bootstrap/Dropdown'
import UserMenu from './UserMenu';
import logo from '../../logo.svg';
import {loginIn} from '../../configs/ajax'
import { setLogState, setDisplay } from '../../redux/actions'

/* This is the component responsible for Main Nav like User Home, Info, Control SignIn/Out UX (not Display Nav)*/
export class Header extends Component {

  itemSelectionHandler(key, e) {
    switch (key) {
      case "1":
        return console.log("do userinfo")
      case "2":
        this.props.setLogState(false);
        this.props.setDisplay("SignInUp");
        return
      default:
        return alert("I do not know what you want me to do")
    }
  }

  componentDidMount() {
  }

  render() {
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
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link onSelect={() => this.props.setDisplay("Timetable")}>Timetable</Nav.Link>
                  <Nav.Link onSelect={() => this.props.setDisplay("Map")}>Map</Nav.Link>
                  {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                      <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown> */}
                </Nav>
                
                <Dropdown onSelect={(key, e) => this.itemSelectionHandler(key, e)}>
                  <Dropdown.Toggle alignright as={UserImage} id="dropdown-custom-components">
                    Custom toggle
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-right" as={UserMenu}>
                    <Dropdown.Item eventKey="1" active>User Info</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Sign Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </Navbar.Collapse>
        </Navbar>
      </>
    )
  }
}

const mapStateToProps = state => {
  
  return { };
};

export default connect(mapStateToProps, { setLogState, setDisplay })(Header);
