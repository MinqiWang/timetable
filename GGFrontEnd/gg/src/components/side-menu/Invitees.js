import React, { Component } from 'react'
import AvatarAndName from '../AvatarAndName'
import '../../style/FriendList.css';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import {recallInvites, inviteesByEventID} from '../../RESTFul/ajax'
import {setFocusEventInvitees, logOut, setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getAddingInvitees, getFriends, getFocusEventInvitees, getFocusEventToInvites} from '../../redux/selecter';

export class Invitees extends Component {
  recall = (e, invitee_id, event_id) => {
    const {setFocusEventInvitees, logOut, setRightMenu} = this.props;
    recallInvites(function(res) {
      inviteesByEventID(function(res) {
        setFocusEventInvitees(res.data);
    }, logOut, event_id)
    }, logOut, event_id, invitee_id)
  }
  
  render() {
    const {friend, event_id, isEventOwner} = this.props;
    let variant;
    let status;
    let recallButton;
    switch (friend.has_accepted) {
      case null:
        variant = "warning"
        status = "PENDING"
        recallButton = <Button onClick={(e) => this.recall(e, friend.id, event_id)}>Recall</Button>
        break;
      case 1:
        variant = "success"
        status = "ACCPECT"
        break;
      case 0:
        variant = "danger"
        status = "REJECT"
        break;
      default:
        variant = "warning"
        status = "PENDING"
    }
    
    return (
        <div className="resultUser">
          <AvatarAndName person={friend}></AvatarAndName>

          <Badge pill variant={variant}>
            {status}
          </Badge>
          {/* owner check */}
          {isEventOwner? (recallButton? recallButton: <Button disabled>Recall</Button>) : null}
        </div>
    )
  }
}

export default connect(null, {logOut, setFocusEventInvitees, setRightMenu})(Invitees);