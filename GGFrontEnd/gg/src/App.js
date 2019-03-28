import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './components/header/Header';
import Display from './components/display/Display';
import SideMenu from './components/side-menu/SideMenu';
import { setLogState, setDisplay, setUser, logOut } from './redux/actions';
import { getLogState, getDisplay, getUser } from './redux/selecter';
import RightMenu from './components/side-menu/RightMenu';
import Message from './Message'

import {retrieveUserInfo} from './RESTFul/ajax';

class App extends Component {

  componentDidMount() {
    // call the auto login
    // this.props.setDisplay("Timetable");

    retrieveUserInfo(
      this.props.setUser,
      this.props.setDisplay, 
      this.props.logOut)
  }

  componentDidUpdate() {
  }
  componentWillUnmount() {

  }

  render() {
    const { User, display } = this.props;
    const sidemenu = User? (
    <div className="App-sidemenu">
      <SideMenu/>
    </div>) : null;

    return (
      <>
      <div className="App">
        <Header/>
        <div className="App-main">
          {sidemenu}
          <div className="App-display">
            <Display display={display}/>
          </div>
          <RightMenu/>
        </div>
      </div>
      <Message/>
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log("App");
  console.log(state);
  const User = getUser(state);
  console.log(User);
  const display = getDisplay(state);
  console.log(display);


  return { display, User };
};

export default connect(mapStateToProps, { logOut, setDisplay, setUser})(App);
