import React, { Component } from 'react';
import Event from './Event'
import {setRightMenu, setFocusEvent, isDefault, isNotDefault} from '../../redux/actions'
import { connect } from 'react-redux';
import { getCurrentEvent, getDefaultEvent_Slots_byDay, getDefaultEvent, getWeekOf, getFocusEvent } from '../../redux/selecter';


export class DayColumn extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         events: []
      }
    }

    componentDidMount() {

    }

    startTimeFromY = (y) => {
        let hour = Math.floor(y/40);
        return +hour+":00:00";
    }

    createNewEvent = (ev) => {
        var rect = ev.target.getBoundingClientRect();

        let EVENT_NAME = "default_event";
        let EVENT_ID = "default_event_ID";
        let SLOT_ID = "default_slot_ID";

        let EVENT_HAS_DETAIL = false;
        let START_TIME = this.startTimeFromY(ev.clientY - rect.top);
        let LENGTH = "60";
        let WEEK_OF = this.props.week_of; 
        let DAY_OF_THE_WEEK = this.props.col_id; 
        let IS_REPEATING = false;
        let OBSCURED_BY = null; 
        let IS_EMPTY_OBSCURE = null;

        const event = {event_id: EVENT_ID, event_name: EVENT_NAME,
            detail:[],
            timetable_slots: {"Sun": [], "Mon": [], 
        "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}};

        event.timetable_slots[DAY_OF_THE_WEEK] = [{id: SLOT_ID, event_id: EVENT_ID, 
            event_name: EVENT_NAME, event_has_detail: false, start_time: START_TIME, 
            length: LENGTH, week_of: WEEK_OF, day_of_the_week: this.props.col_id, 
            is_repeating: false, obscured_by: null, is_empty_obscure: null}];
        /* {detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], timetable_slots: 
 * [["event1", true, "8:45:00", "15", "2019-03-17", 1, false, null, null], [...] ...]} */
        // new View with Default value, setDefaultEvent, setCurrentEvent, setRightMenu="Edit"
        this.props.setFocusEvent(event);
        this.props.isDefault();
        this.props.setRightMenu("Edit");
        // open up the edit right menu with default value
        // if cancel or clicked else where, cancel the view, setDefaultEvent=null, setCurrentEvent=null, setRightMenu="Close"
    }

    render() {
        const {col_id, default_slots, slots} = this.props;
        console.log(slots);
        console.log(default_slots);

        return (
        <div id={col_id} onDoubleClick={this.createNewEvent} className="scroll-slots-col">
            {slots.map((slot) => 
            <Event key={slot.id} col_id={col_id} slot={slot}></Event>)}
            {default_slots.map((slot) =>  
            <Event key={slot.id} col_id={col_id} slot={slot} shouldDecorate={true}></Event>)}
        </div>
        )
    }
}

// const mapStateToProps = state => {
//     console.log("DayCol");
//     console.log(state);
//     const focused_event = getFocusEvent(state);
//     const week_of = getWeekOf(state);
//     return {week_of};
// };

export default connect(null, {isDefault, setRightMenu, setFocusEvent})(DayColumn);
