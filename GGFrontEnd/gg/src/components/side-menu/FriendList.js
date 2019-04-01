import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import '../../style/FriendList.css';
import { logOut, setWatching, setSlots, setAcceptSlots} from '../../redux/actions'
import { connect } from 'react-redux';
import AvatarAndName from '../AvatarAndName';
import { retrieveAllSlotsInAWeek, retrieveAcceptedInAWeek } from '../../RESTFul/ajax';
import {getWeekOf} from '../../redux/selecter';



export class FriendList extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
      }
    }

    timetable = (e, watching) => {
      this.props.setWatching(watching);
      console.warn(this.props.week_of);
      retrieveAllSlotsInAWeek(this.props.setSlots, this.props.logOut, this.props.week_of, watching.id);
      retrieveAcceptedInAWeek(this.props.setAcceptSlots, this.props.logOut, this.props.week_of, watching.id);
      //retrieve
    }
    
    
  render() {
    const {friends, searchQuery} = this.props;

    return (
        <div className="FriendList">
            {/*Search_Result sort by alphabetical order*/}
            {friends.filter(friend => {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
            <div className="resultUser" key={friend.id}>
              <AvatarAndName person={friend}></AvatarAndName>
              <Button size="sm" onClick={(e) => this.timetable(e, friend)}>Timetable</Button>
            </div>
            )}
        </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("FriendList");
    console.log(state);
  const week_of = getWeekOf(state);
  return {week_of};
};
export default connect(mapStateToProps, { logOut, setWatching, setSlots, setAcceptSlots, logOut})(FriendList);
