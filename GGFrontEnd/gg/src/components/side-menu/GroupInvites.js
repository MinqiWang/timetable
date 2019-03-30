import React, { Component } from 'react'

export class GroupInvites extends Component {
  render() {
    const {invite_groups, searchQuery} = this.props;

    return (
        <div className="FriendList">
            {/*Search_Result sort by alphabetical order*/}
            {invite_groups.filter(groups => {return (searchQuery == "" || groups.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(group => 
            <div className="resultUser" key={group.id}>
              {/* <Image src={friend.avatarURL} roundedCircle />
              <div>{friend.name}</div>
              <Button onClick={this.timetable}>Timetable</Button> */}
            </div>
            )}
        </div>
    )
  }
}

export default GroupInvites
