import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './components/header/Header';
import Display from './components/display/Display';
import SideMenu from './components/side-menu/SideMenu';
import { setLogState, setDisplay, setUser, logOut } from './redux/actions';
import { getLogState, getDisplay, getRightMenu, getUser } from './redux/selecter';
import RightMenu from './components/side-menu/RightMenu';

import {retrieveUserInfo} from './configs/ajax';

class App extends Component {
  componentDidMount() {
    // call the auto login
    this.props.setDisplay("Timetable");

    retrieveUserInfo(function(res) {
      this.props.setUser(res);
      this.props.setDisplay("Timetable");
    }, this.props.logOut)
  }

  componentDidUpdate() {
  }

  render() {
    const { User, display, rightMenu } = this.props;

    const sidemenu = User? (
    <div className="App-sidemenu">
      <SideMenu/>
    </div>) : null;

    return (
      <div className="App">
        <Header/>
        <div className="App-main">
          {sidemenu}
          <div className="App-display">
            <Display display={display}/>
          </div>
          <RightMenu rightMenu={rightMenu}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const User = getUser(state);
  const display = getDisplay(state);
  const rightMenu = getRightMenu(state);
  return { display, rightMenu, User };
};

export default connect(mapStateToProps, { logOut, setDisplay, setUser})(App);
