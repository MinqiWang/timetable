import React, { Component } from 'react'
import AvatarAndName from '../AvatarAndName'
import '../../style/FriendList.css';

export class Invitees extends Component {
  render() {
    const {friends, searchQuery} = this.props;

    return (
      <div className="FriendList">
        <div className="resultUser">
        {friends.filter(friend => {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
          <AvatarAndName person={friend}></AvatarAndName>
        )}
        </div>
      </div>
    )
  }
}

export default Invitees
