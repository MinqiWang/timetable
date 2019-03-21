import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './components/header/Header';
import Display from './components/display/Display';
import SideMenu from './components/side-menu/SideMenu';
import { setLogState, setDisplay, setUser } from './redux/actions';
import { getLogState, getDisplay, getRightMenu } from './redux/selecter';
import RightMenu from './components/side-menu/RightMenu';

import {retrieveUserInfo} from './configs/ajax';

class App extends Component {
  componentDidMount() {
    // call the auto login
    retrieveUserInfo(function(res) {
      this.props.setUser(res);
      this.props.setDisplay("Timetable");
      this.props.setLogState(true);
    })
  }

  componentDidUpdate() {
  }

  render() {
    const { isLogIn, display, rightMenu } = this.props;

    const sidemenu = isLogIn? (
    <div className="App-sidemenu">
      <SideMenu/>
    </div>) : null;

    return (
      <div className="App">
        <Header isLogIn={isLogIn}/>
        <div className="App-main">
          {sidemenu}
          <div className="App-display">
            <Display display={display} isLogIn={isLogIn}/>
          </div>
          <RightMenu rightMenu={rightMenu}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const isLogIn = getLogState(state);
  const display = getDisplay(state);
  const rightMenu = getRightMenu(state);
  return { isLogIn, display, rightMenu };
};

export default connect(mapStateToProps, { setLogState, setDisplay, setUser})(App);
