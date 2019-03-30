import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import '../../style/FriendList.css';
import { logOut, setWatching } from '../../redux/actions'
import { connect } from 'react-redux';
import AvatarAndName from '../AvatarAndName';


export class FriendList extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
      }
    }

    timetable = (e, watching) => {
      this.props.setWatching(watching);
    }
    
    
  render() {
    const {friends, searchQuery} = this.props;

    return (
        <div className="FriendList">
            {/*Search_Result sort by alphabetical order*/}
            {friends.filter(friend => {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
            <div className="resultUser" key={friend.id}>
              <AvatarAndName person={friend}></AvatarAndName>
              <Button onClick={(e) => this.timetable(e, friend)}>Timetable</Button>
            </div>
            )}
        </div>
    )
  }
}
export default connect(null, { logOut, setWatching })(FriendList);
