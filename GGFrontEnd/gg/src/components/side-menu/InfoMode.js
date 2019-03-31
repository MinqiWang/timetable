import React, { Component } from 'react';
import {setFocusEvent, setRightMenu, logOut, setSlots, setFocusEventInvitees} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFocusEvent, getWeekOf, getUser } from '../../redux/selecter';
import '../../style/RightMenu.css';
import {deleteEvent, retrieveAllSlotsInAWeek, inviteesByEventID} from '../../RESTFul/ajax'

export class InfoMode extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
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
        const {logOut, focused_event, setFocusEventInvitees, setRightMenu} = this.props;
        inviteesByEventID(function(res) {
            console.warn(res.data)
            setFocusEventInvitees(res.data);
            setRightMenu("Invitee");
        }, logOut, focused_event.detail.id)
    }

    delete = (ev) => {
        const { focused_event, logOut, setSlots, week_of, setRightMenu} = this.props;
        deleteEvent(function(res) {
            setRightMenu("Close");
            setFocusEvent();
            retrieveAllSlotsInAWeek(setSlots, logOut, week_of);
        }, logOut, focused_event.detail.id);
    }

  render() {
    const { focused_event, User } = this.props;
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
            {/* {focused_event.timetable_slots[].map(slot => {<TimeslotDetail slot={slot}></TimeslotDetail>})} */}

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

export default connect(mapStateToProps, {setFocusEvent, setFocusEventInvitees, setRightMenu, logOut, setSlots})(InfoMode);
