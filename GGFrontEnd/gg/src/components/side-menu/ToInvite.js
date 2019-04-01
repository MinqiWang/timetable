import React, { Component } from 'react'
import AvatarAndName from '../AvatarAndName'
import Form from 'react-bootstrap/Form'
import {setAddingInvitees} from '../../redux/actions';
import { connect } from 'react-redux';
import { getAddingInvitees} from '../../redux/selecter';
import { toInviteByEventID} from '../../RESTFul/ajax'

export class ToInvite extends Component {

  inviteChange = (e, id) => {

    const {setAddingInvitees, addingInvitees} = this.props;
    if (e.target.checked) {
      if (!addingInvitees.invitees.includes(id)) {
        addingInvitees.invitees.push(id);
        setAddingInvitees(addingInvitees);
      }
    } else {
        let index = addingInvitees.invitees.indexOf(id);
        if (index > -1) {
          addingInvitees.invitees.splice(index, 1);
          setAddingInvitees(addingInvitees);
        }
    }
  }
  
  render() {
    const {friend} = this.props;

    return (
      <div className="resultUser">
        <AvatarAndName person={friend}></AvatarAndName>
        <Form.Check inline type="checkbox" label="Invite" onChange={(e)=>this.inviteChange(e, friend.id)}/>
      </div>
    )
  }
}
const mapStateToProps = state => {
  const addingInvitees = getAddingInvitees(state);
  return {addingInvitees};
};

export default connect(mapStateToProps, { setAddingInvitees })(ToInvite);
