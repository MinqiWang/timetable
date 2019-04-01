import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './components/header/Header';
import Display from './components/display/Display';
import SideMenu from './components/side-menu/SideMenu';
import { setAcceptSlots, setSlots, setLogState, setDisplay, setUser, logOut, setShowMessage,setFriends,
  setPendingRequests,
  setMyGroupEvents,
  setOthersGroupEvents } from './redux/actions';
import { getLogState, getDisplay, getUser, getWeekOf, getPage1, getPage2, getWatching } from './redux/selecter';
import RightMenu from './components/side-menu/RightMenu';
import Message from './Message'
import {ErrorMessage} from './redux/reducers/message'

import {longPoll, 
  retrieveUserInfo, 
  retrieveFriendlist, 
  retrievePendingFriendlist,
  retrieveAllSlotsInAWeek,
  retrieveAcceptedInAWeek,
  retrieveMyGroupEvents,
  retrieveOthersGroupEvents,} from './RESTFul/ajax';

class App extends Component {
  constructor(props) {
    super(props)
    document.addEventListener("contextmenu", (e)=>e.preventDefault());
    this.state = {
       
    }
  }
  

  componentDidMount() {
    const {setShowMessage} = this.props;
    let callback = function(longPollRes) {
      console.warn(longPollRes);
      
      switch (longPollRes.data.indicator) {
        case 0:
          retrieveFriendlist(function(res) {
            this.props.setFriends(res.data);
          }, function(res) {console.warn(res); setShowMessage(ErrorMessage);});
          retrievePendingFriendlist(function(res) {
            this.props.setPendingRequests(res.data);
          }, function(res) {console.warn(res); setShowMessage(ErrorMessage);});
          break;
        case 1:
          // watching panduan
          console.warn("enter 1");
          console.warn(this.props.Watching);
          if (this.props.Watching) {
            retrieveAllSlotsInAWeek(this.props.setSlots, function(res) {
              console.warn(res); setShowMessage(ErrorMessage);}, 
              this.props.week_of, this.props.Watching.id);
            retrieveAcceptedInAWeek(this.props.setAcceptSlots, 
              function(res) {console.warn(res); setShowMessage(ErrorMessage);}, 
              this.props.week_of, this.props.Watching.id);
          } else {
            retrieveAllSlotsInAWeek(this.props.setSlots, 
              function(res) {console.warn(res); setShowMessage(ErrorMessage);}, 
              this.props.week_of);
            retrieveAcceptedInAWeek(this.props.setAcceptSlots, 
              function(res) {console.warn(res); setShowMessage(ErrorMessage);}, 
              this.props.week_of);
          }
          break;
        case 2:
          retrieveMyGroupEvents(function(res) {this.props.setMyGroupEvents(res.data);}.bind(this), 
          function(res) {console.warn(res); setShowMessage(ErrorMessage);}, 
          this.props.page_num1);
          retrieveOthersGroupEvents(function(res) {this.props.setOthersGroupEvents(res.data);}.bind(this), 
          function(res) {console.warn(res); setShowMessage(ErrorMessage);}, 
          this.props.page_num2);
          break;
      }
      longPoll(callback, err_callback);
    }.bind(this);
    
    let err_callback = function(err) {
      console.warn(err);
      longPoll(callback, err_callback);
    }
    longPoll(callback, err_callback);

    // call the auto login
    // document.addEventListener("contextmenu", (e)=> e.preventDefault());
    retrieveUserInfo(
      this.props.setUser,
      this.props.setDisplay, 
      this.props.logOut)
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
  const User = getUser(state);
  const display = getDisplay(state);
  const week_of = getWeekOf(state);
  const page_num1 = getPage1(state);
  const page_num2 = getPage2(state);
  const Watching = getWatching(state);
  return { display, User, week_of, page_num1, page_num2, Watching };
};

export default connect(mapStateToProps, { logOut, setDisplay, setUser, setShowMessage, 
  setFriends,
  setPendingRequests,
  setMyGroupEvents,
  setOthersGroupEvents, setSlots, setAcceptSlots})(App);
