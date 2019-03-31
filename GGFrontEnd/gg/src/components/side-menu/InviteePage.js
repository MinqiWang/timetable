import React, { Component } from 'react'
import ToInvite from './ToInvite';
import Invitees from './Invitees';
import Button from 'react-bootstrap/Button';
import InputGroup from'react-bootstrap/InputGroup';
import FormControl from'react-bootstrap/FormControl';
import {setFocusEventInvitees, setRightMenu, setFocusEventToInvites, logOut, setAddingInvitees} from '../../redux/actions';
import { connect } from 'react-redux';
import { getAddingInvitees, getFriends, getFocusEventInvitees, getFocusEventToInvites} from '../../redux/selecter';
import { inviteesByEventID, toInviteByEventID, sendInvitesToFriends} from '../../RESTFul/ajax'


export class InviteePage extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       isInviting: false,
       searchQuery: "",
    }
  }
  

    back = (e) => {
        this.props.setRightMenu("Info");
    }

    addInvitee = (e) => {
      const {setFocusEventToInvites, logOut, focused_event} = this.props;
      toInviteByEventID(function(res){
        setFocusEventToInvites(res.data);
      }, logOut, focused_event.detail.id)
      this.setState({isInviting: true});
    }

    cancelInvite = (e) => {
      this.props.setAddingInvitees();
      console.warn("wtf");
      this.setState({isInviting: false});
      this.setState({searchQuery: ""})
      document.getElementById("invite-SearchBar").value = "";
    }

    search = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let searchQuery = document.getElementById("invite-SearchBar").value;
      this.setState({searchQuery})
    }
  
    cancel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({searchQuery: ""})
      document.getElementById("invite-SearchBar").value = "";
    }

    sendInvites = (e) => {
      const {setFocusEventInvitees, addingInvitees, setAddingInvitees, focused_event, logOut} = this.props;
      if (addingInvitees.invitees.length == 0) {
        console.log("no selection");
      } else {
        sendInvitesToFriends(function(res) {
          setAddingInvitees();
          inviteesByEventID(function(res) {
            setFocusEventInvitees(res.data);
          }, logOut, focused_event.detail.id);
        }, logOut, focused_event.detail.id, addingInvitees);

        this.setState({isInviting: false});
        this.setState({searchQuery: ""});
        document.getElementById("invite-SearchBar").value = "";
      }  
    }
    
  render() {
    const {isInviting, searchQuery} = this.state;
    const {focused_event, focusEventInvitees, focusEventToInvites} = this.props;
    let placeholder= isInviting? "To Invite": "Invited"
    return (
      <div>
        <div className="Nav-Btns">
          {
            isInviting? 
            <>
            <button onClick={this.sendInvites}>send Invites</button>

            <button onClick={this.cancelInvite}>cancel</button>
            </>
            : 
            <>
            <button onClick={this.addInvitee}>add more friends</button>

            <button onClick={this.back}>back</button>
            </>
          }
            
        </div>
        <div className="SearchBar">
            <InputGroup className="mb-3">
                <FormControl
                id="invite-SearchBar"
                placeholder= {placeholder + " friend's name"}
                aria-label={placeholder + " friend's name"}
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Go</Button>
                    <Button variant="secondary" onClick={this.cancel}>Clear</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
        <div className="FriendList">
        
        {isInviting? 
          focusEventToInvites.filter(friend => 
            {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
              <ToInvite key={friend.id} friend={friend}/>)
              :
          focusEventInvitees.filter(friend => 
            {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend =>   
              <Invitees key={friend.id} friend={friend} event_id={focused_event.detail.id}/>)}
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("Invitee");
  console.log(state);
  const focusEventInvitees = getFocusEventInvitees(state);
  const focusEventToInvites = getFocusEventToInvites(state);
  const addingInvitees = getAddingInvitees(state);
  
  return {addingInvitees, focusEventInvitees, focusEventToInvites};
};

export default connect(mapStateToProps, {setFocusEventInvitees, setAddingInvitees, setRightMenu, logOut, setFocusEventToInvites})(InviteePage);
