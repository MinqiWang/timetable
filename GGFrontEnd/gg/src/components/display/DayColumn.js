import React, { Component } from 'react';
import Event from './Event'
import {setCurrEvent, setRightMenu, setDefaultEvent} from '../../redux/actions'
import { connect } from 'react-redux';
import { getCurrentEvent, getDefaultEvent_Slots_byDay, getDefaultEvent } from '../../redux/selecter';


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
        let WEEK_OF = "2019-03-17"; 
        let DAY_OF_THE_WEEK = this.props.col_id; 
        let IS_REPEATING = false;
        let OBSCURED_BY = null; 
        let IS_EMPTY_OBSCURE = null;
        const event = {detail:[],
            timetable_slots: {"Sun": [], "Mon": [], 
        "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}};
        event.timetable_slots[DAY_OF_THE_WEEK] = [{SLOT_ID: SLOT_ID, EVENT_ID: EVENT_ID, 
            EVENT_NAME: EVENT_NAME, EVENT_HAS_DETAIL: false, START_TIME: START_TIME, 
            LENGTH: LENGTH, WEEK_OF: "2019-03-17", DAY_OF_THE_WEEK: this.props.col_id, 
            IS_REPEATING: false, OBSCURED_BY: null, IS_EMPTY_OBSCURE: null}];
        /* {detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], timetable_slots: 
 * [["event1", true, "8:45:00", "15", "2019-03-17", 1, false, null, null], [...] ...]} */
        // new View with Default value, setDefaultEvent, setCurrentEvent, setRightMenu="Edit"
        this.props.setDefaultEvent(event);
        this.props.setCurrEvent(event);
        this.props.setRightMenu("Edit");
        // open up the edit right menu with default value
        // if cancel or clicked else where, cancel the view, setDefaultEvent=null, setCurrentEvent=null, setRightMenu="Close"
    }

    render() {
        const {col_id, default_slots, slots} = this.props;
        return (
        <div id={col_id} onDoubleClick={this.createNewEvent} className="scroll-slots-col">
            {slots.map((slot) => 
            <Event key={slot.SLOT_ID} col_id={col_id} event={slot}></Event>)}
            {default_slots.map((slot) =>  
            <Event key={slot.SLOT_ID} col_id={col_id} event={slot} shouldDecorate={true}></Event>)}
        </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("DayCol");
    console.log(state);
    const default_event = getDefaultEvent(state);
    return {default_event};
};

export default connect(mapStateToProps, {setCurrEvent, setRightMenu, setDefaultEvent})(DayColumn);
