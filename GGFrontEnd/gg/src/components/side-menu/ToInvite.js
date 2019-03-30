import React, { Component } from 'react'
import AvatarAndName from '../AvatarAndName'
import Form from 'react-bootstrap/Form'

export class ToInvite extends Component {

  inviteChange = () => {
    
  }
  
  render() {
    const {friends, searchQuery} = this.props;

    return (
      <div className="FriendList">
        <div className="resultUser">
        {friends.filter(friend => {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
          <>
          <AvatarAndName person={friend}></AvatarAndName>
          <Form.Check inline type="checkbox" label="Invite" onChange={this.inviteChange}/>
          
          </>
        )}
        </div>
        
      </div>
    )
  }
}

export default ToInvite
