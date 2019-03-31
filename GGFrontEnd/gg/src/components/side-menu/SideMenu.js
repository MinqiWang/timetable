import React, { Component } from 'react'
import '../../style/SideMenu.css';
import {setFriends, setMyGroupEvents, setOthersGroupEvents, logOut} from '../../redux/actions'
import {connect} from 'react-redux';
import { getFriends, getMyGroupEvents, getOthersGroupEvents} from '../../redux/selecter';
import FriendList from './FriendList';
import GroupInvites from './GroupInvites';
import MyGroups from './MyGroups';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from'react-bootstrap/InputGroup';
import FormControl from'react-bootstrap/FormControl';
import Form from 'react-bootstrap/FormControl';
import {retrieveFriendlist, retrieveOthersGroupEvents, retrieveMyGroupEvents} from '../../RESTFul/ajax'


export class SideMenu extends Component {
  constructor(props) {
    super(props)

    const {setFriends, logOut, setMyGroupEvents, setOthersGroupEvents} = this.props;
    retrieveFriendlist(function(res) {
      setFriends(res.data);
    }, logOut);

    
    retrieveMyGroupEvents(function(res) {
      setMyGroupEvents(res.data);
    }, logOut, 0);

    retrieveOthersGroupEvents(function(res) {
      setOthersGroupEvents(res.data);
    }, logOut, 0);
    
    this.state = {
      show: false,
      displayControl: "FriendList", // "MyGroups", "GroupInvites"
      searchQuery: "",
    }
  }

  search = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.warn(this.state.displayControl);
    let searchQuery = document.getElementById(this.state.displayControl+"SearchBar").value;
    this.setState({searchQuery})
  }

  cancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({searchQuery: ""})
    document.getElementById(this.state.displayControl+"SearchBar").value = "";
  }

  showSideMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      show: !prevState.show
    }))
  }

  showDisplay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let displayControl;
    switch (e.target.id) {
      case "FriendListContol":
        displayControl = "FriendList"
        break;
      case "MyGroupsContol":
        displayControl = "MyGroups"
        break;
      case "GroupInvitesContol":
        displayControl = "GroupInvites"
        break;
    }
    this.setState({
      displayControl
    });
  }

  render() {
    const {show, displayControl, searchQuery} = this.state;
    let {Friends, MyGroupEvents, OthersGroupEvents} = this.props;
    let showOrCollapse = show? "Collapse" : "Menu";
    // let friendList = this.sort(Friends);
    let display;
    let place_holder;
    switch (displayControl) {
      case "FriendList":
        display = (<FriendList friends={Friends} searchQuery={searchQuery}></FriendList>)
        place_holder = "Friend's Name";
        break;
      case "MyGroups":
        display = (<MyGroups my_groups={MyGroupEvents} searchQuery={searchQuery}></MyGroups>)
        place_holder = "Event's Name"
        break;
      case "GroupInvites":
        display = (<GroupInvites invite_groups={OthersGroupEvents} searchQuery={searchQuery}></GroupInvites>)
        place_holder = "Event/Inviter's Name"
        break;
      default:
        display = (<div>error</div>)
        place_holder = "Error"
    }

    return (
      <>
      {show? 
      <div className="MainSideDisplay">
        <div className="SearchBar">
            <InputGroup size="sm" className="mb-0">
                <FormControl
                id={displayControl+"SearchBar"}
                placeholder={place_holder}
                aria-label={place_holder}
                aria-describedby="basic-addon2"
                defaultValue={searchQuery}
                />
            </InputGroup>
        </div>
        <div className="SearchBar-Button">
          <Button size="sm" variant="primary" onClick={this.search}>Go</Button>
          <Button size="sm" variant="secondary" onClick={this.cancel}>Clear</Button>
        </div>
        {display}
      </div> : null
      }

      <div>
        <ButtonGroup size="sm" vertical>
          <Button onClick={this.showSideMenu}>{showOrCollapse}</Button>
          {show? 
          <>
          <Button id="FriendListContol" onClick={this.showDisplay}>Friends</Button>
          <Button id="MyGroupsContol" onClick={this.showDisplay}>My Groups</Button>
          <Button id="GroupInvitesContol" onClick={this.showDisplay}>Event Invites</Button>
          </>:null}
          
                  
        </ButtonGroup>
      </div>
      
      </>
    )
  }
}

const mapStateToProps = state => {
  console.log("SideMenu");
  console.log(state);
  const Friends = getFriends(state);
  const MyGroupEvents = getMyGroupEvents(state);
  const OthersGroupEvents = getOthersGroupEvents(state);
  return {Friends, MyGroupEvents, OthersGroupEvents};
};
export default connect(mapStateToProps, {logOut, setFriends, setMyGroupEvents, setOthersGroupEvents})(SideMenu);