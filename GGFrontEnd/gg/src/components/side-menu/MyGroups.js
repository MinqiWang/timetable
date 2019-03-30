import React, { Component } from 'react'

export class MyGroups extends Component {
  render() {
    const {my_groups, searchQuery} = this.props;

    return (
        <div className="FriendList">
            {/*Search_Result sort by alphabetical order*/}
            {my_groups.filter(group => {return (searchQuery == "" || group.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(group => 
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

export default MyGroups
