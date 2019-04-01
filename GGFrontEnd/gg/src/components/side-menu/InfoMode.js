import React, { Component, Fragment } from 'react';
import {setFocusEvent, setRightMenu, logOut, setSlots, setFocusEventInvitees, setShowMessage} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFocusEvent, getWeekOf, getUser } from '../../redux/selecter';
import '../../style/RightMenu.css';
import {deleteEvent, retrieveAllSlotsInAWeek, inviteesByEventID} from '../../RESTFul/ajax'
import TimeslotDetailInfo from './TimeslotDetailInfo';
import '../../style/GroupEvents.css'
import {ErrorMessage} from '../../redux/reducers/message'

export class InfoMode extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      }
    }

    edit = (ev) => {
        this.props.setRightMenu("Edit");
    }

    close = (ev) => {
        this.props.setFocusEvent();
        this.props.setRightMenu("Close");
    }

    addInvitees = (e) => {
        const {logOut, focused_event, setFocusEventInvitees, setRightMenu, setShowMessage} = this.props;
        inviteesByEventID(function(res) {
            console.warn(res.data)
            setFocusEventInvitees(res.data);
            setRightMenu("Invitee");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, focused_event.detail.id)
    }

    delete = (ev) => {
        const { focused_event, logOut, setSlots, week_of, setRightMenu, setShowMessage} = this.props;
        deleteEvent(function(res) {
            setRightMenu("Close");
            setFocusEvent();
            retrieveAllSlotsInAWeek(setSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, week_of);
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, focused_event.detail.id);
    }

  render() {
    const { focused_event, User } = this.props;
    const {days} = this.state;
    return (
        <div className="App-rightmenu">
            <div className="Nav-Btns">
                {/* owner check */}
                {(focused_event.detail.author_id == User.id)? <><button onClick={this.edit}>edit</button>
                <button onClick={this.delete}>delete</button></>: null
                }
                
                <button onClick={this.addInvitees}>invitees</button>
                <button onClick={this.close}>close</button>
            </div>
            
            <h1>{focused_event.detail.event_name}</h1>
            <div>{focused_event.detail.text_content}</div>
            {days.map(day => 
                <Fragment key={day}>{focused_event.timetable_slots[day].map(slot=>
                    <div className="resultGroup" key={slot.id}>
                        <TimeslotDetailInfo slot={slot}></TimeslotDetailInfo>
                    </div>
                    )
                }</Fragment>
                )}
        {/* {curr_event.id} */}
        </div>
    )
  } 
}

const mapStateToProps = state => {
    const week_of = getWeekOf(state);
    const User = getUser(state);
    return {week_of, User};
};

export default connect(mapStateToProps, {setFocusEvent, setFocusEventInvitees, setRightMenu, logOut, setSlots, setShowMessage})(InfoMode);
