import React, { Component } from 'react';
import Event from './Event'
import {setRightMenu, setFocusEvent, isDefault, isNotDefault, setTargetSlot, setShowMessage} from '../../redux/actions'
import { connect } from 'react-redux';
import { getTargetSlot, getCurrentEvent, getDefaultEvent_Slots_byDay, getDefaultEvent, getWeekOf, getFocusEvent, getRightMenu } from '../../redux/selecter';
import { undecorate } from '../../utils';
import {onEditMessage, onSaveMessage} from '../../redux/reducers/message'


export class DayColumn extends Component {
    constructor(props) {
      super(props)
      let {week_of, indice} = this.props;
      this.state = {
         events: [],
      }
    }

    startTimeFromY = (y) => {
        let hour = Math.floor(y/40);
        return +hour+":00:00";
    }

    createNewEvent = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (this.props.rightMenu == "Edit") {
            console.log("hhh");
            this.props.setShowMessage(onEditMessage);
            return;
        }
        
        undecorate(Array.from(document.getElementsByClassName(this.props.focused_event.event_id)));
        var rect = ev.target.getBoundingClientRect();

        let EVENT_NAME = "default_event";
        let EVENT_ID = "default_event_ID";
        let SLOT_ID = "default_slot_ID";

        let EVENT_HAS_DETAIL = false;
        let START_TIME = this.startTimeFromY(ev.clientY - rect.top);
        let LENGTH = "60";
        let WEEK_OF = this.props.week_of; 
        let DAY_OF_THE_WEEK = this.props.col_id;
        let DAY_OF_THE_WEEK_num = this.props.indice;
        let IS_REPEATING = false;
        let OBSCURED_BY = null; 
        let IS_EMPTY_OBSCURE = null;

        const event = {event_id: EVENT_ID, event_name: EVENT_NAME,
            detail:["", "", ""],
            timetable_slots: {"Sun": [], "Mon": [], 
        "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}};

        event.timetable_slots[DAY_OF_THE_WEEK] = [{id: SLOT_ID, event_id: EVENT_ID, 
            event_name: EVENT_NAME, event_has_detail: false, start_time: START_TIME, 
            length: LENGTH, week_of: WEEK_OF, day_of_the_week: DAY_OF_THE_WEEK_num, 
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

    eventRecreation = (e, targetSlot, colId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (targetSlot.isDragging) {
            // if isDragging
            //delete old slot with
            let slot_to_move = document.getElementById(targetSlot.id);
            // let parentCol = document.getElementById(colId);

            if (slot_to_move) {
                try{
                    e.target.appendChild(slot_to_move);
                }
                catch (error) {
                    // console.log(error);
                }
                finally {
                }
            }
        }
        //is not dragging, do nothing
    }

    onLeave = (e, targetSlot) => {
        e.preventDefault();
        e.stopPropagation();
    }

    eventMove = (e, targetSlot) => {
        e.preventDefault();
        e.stopPropagation();
        
        // console.log(targetSlot);
        let element = document.getElementById(targetSlot.id);
        let eventTime = document.getElementById("eventTime"+targetSlot.id);
        let eventLength = document.getElementById("eventLength"+targetSlot.id);


        if (element == null) return;

        //if isResizing, do Resizing
        if (targetSlot.isResizing) {
            let add_height = e.clientY - targetSlot.original_mouse_y;
            let right_add_height = Math.ceil(add_height/10)*10;
            let temp_height = targetSlot.original_height + right_add_height;
            if ( (temp_height >= targetSlot.minimum_bound) 
            && ((targetSlot.original_y + temp_height) <= targetSlot.maximum_bound)) {
                element.style.height = temp_height + 'px';
                eventLength.innerHTML = `${+Math.round(temp_height/10*15) + " mins"}`
            }
        }
        //if isDragging, do Dragging
        else if (targetSlot.isDragging) {
            
            let temp_top = (e.clientY - targetSlot.difference_y);
            let max_top = Math.ceil(temp_top/10)*10;
            let min_top = Math.floor(temp_top/10)*10;
            
            if ((temp_top % 10) > 5 
            && (max_top + targetSlot.original_height) <= targetSlot.maximum_bound) {
                element.style.top = max_top + 'px';
                let hour = +Math.floor(max_top/40)
                let mins = (max_top%40)/10*15;
                let time = hour + ":" + (mins == 0? "00": mins);
                eventTime.innerHTML = `${time}`

            } else if ((temp_top % 10) <= 5 
            && min_top >= targetSlot.minimum_bound 
            && (min_top + targetSlot.original_height) <= targetSlot.maximum_bound) {
                element.style.top = min_top + 'px';
                let hour = +Math.floor(min_top/40)
                let mins = (min_top%40)/10*15;
                let time = hour + ":" + (mins == 0? "00": mins);
                eventTime.innerHTML = `${time}`
            }
        }
        //else do nothing
    }

    solidifyEvent = (e, targetSlot) => {
        e.preventDefault();
        e.stopPropagation();
        let element = document.getElementById(targetSlot.id);

        if (element == null) return;

        undecorate([element]);
        //reset targetSlot
        this.props.setTargetSlot();
        //axios, after saving, get all slots in a week
        
    }

    render() {
        const {col_id, default_slots, slots, targetSlot} = this.props;
        
        return (
        <div id={col_id} onDoubleClick={this.createNewEvent}
        onMouseEnter={(e) => this.eventRecreation(e, targetSlot, col_id)} 
        onMouseLeave={(e) => this.onLeave(e, targetSlot)} 
        onMouseMove={(e) => this.eventMove(e, targetSlot)} 
        onMouseUp={(e) => this.solidifyEvent(e, targetSlot)} className="scroll-slots-col">
            {slots.map((slot) => 
            <Event key={slot.id} col_id={col_id} slot={slot}></Event>)}
            {default_slots.map((slot) =>  
            <Event key={slot.id} col_id={col_id} slot={slot} shouldDecorate={true}></Event>)}
        </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("DayCol");
    console.log(state);
    // const focused_event = getFocusEvent(state);
    const targetSlot = getTargetSlot(state);
    const rightMenu = getRightMenu(state);
    const focused_event = getFocusEvent(state);

    return {targetSlot, rightMenu, focused_event};
};

export default connect(mapStateToProps, {isDefault, setRightMenu, setFocusEvent, setTargetSlot, setShowMessage})(DayColumn);
