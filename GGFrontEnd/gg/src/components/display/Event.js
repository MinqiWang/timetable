import React, { Component } from 'react';
import {logOut, setFocusEvent, setRightMenu, isNotDefault, setTargetSlot, setShowMessage} from '../../redux/actions'
import { connect } from 'react-redux';
import { getFocusEvent, getIsDefault, getTargetSlot, getRightMenu } from '../../redux/selecter';
import {decorate, undecorate, opacity05} from '../../utils'
import {onEditMessage, onSaveMessage} from '../../redux/reducers/message'
import {retrieveAllForEvent} from '../../RESTFul/ajax'

export class Event extends Component {

    constructor(props) {
    super(props)
    

    this.drager_mousedown = this.drager_mousedown.bind(this);
    this.resizer_mousedown = this.resizer_mousedown.bind(this);
        this.state = {
            top: 0,
            height: 0,
        }
    }

    drager_mousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.props.rightMenu === "Edit") {
            console.log("hhh");
            this.props.setShowMessage(onEditMessage);
            return;
        }
        if (e.button == 0) {
            console.warn("hhh");
            let element = e.currentTarget;
            opacity05([element]);
            let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
            
            let difference_y = e.clientY - original_y;
            let targetSlot = {
                isDragging: true,
                isResizing: false,
                id: element.id,
                event_id: this.props.slot.event_id,
                top: original_y,
                height: original_height,
                original_height: original_height,
                original_y: 0,
                original_mouse_y: 0,
                difference_y: difference_y,
                minimum_bound: 0,
                maximum_bound: 960,
                length: this.props.slot.length,
                start_time: this.props.slot.start_time,
                event_name: this.props.slot.event_name,
                col_id: this.props.col_id,
                fake_top: original_y,
                fake_height: original_height,
            }
    
            this.props.setTargetSlot(targetSlot);
        }

        // save needed value or info of this event to redux, set isDragging
    };

    mouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let newTargetSlot = Object.assign({}, this.props.targetSlot);
        newTargetSlot.isHidden = false;
        this.props.setTargetSlot(newTargetSlot);
    }

    rightClickUp = (e, slot, isDefault, focused_event) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button == 2) {
            
            console.warn("lll");
            e.preventDefault();
            e.stopPropagation();
            if (this.props.rightMenu === "Edit") {
                this.props.setShowMessage(onEditMessage);
                return;
            }
            
            // this event is default one
            if (isDefault) return;

            // this event is not default one;
            if (focused_event) {
                undecorate(Array.from(document.getElementsByClassName(focused_event.event_id)));
                if (this.props.hasDefault) {
                    isNotDefault();
                }
            }
            decorate(Array.from(document.getElementsByClassName(slot.event_id)));

            //set the elmt to be the current focused event for the right menu
            // axios get detail, make the structual for current event
            
            retrieveAllForEvent(this.props.setFocusEvent, this.props.logOut, slot.event_id);
            this.props.setRightMenu("Info");
        }
    }

    openInfo = (e, slot, isDefault, focused_event) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.rightMenu === "Edit") {
            this.props.setShowMessage(onEditMessage);
            return;
        }
        
        // this event is default one
        if (isDefault) return;

        // this event is not default one;
        if (focused_event) {
            undecorate(Array.from(document.getElementsByClassName(focused_event.event_id)));
            if (this.props.hasDefault) {
                isNotDefault();
            }
        }
        decorate(Array.from(document.getElementsByClassName(slot.event_id)));

        //set the elmt to be the current focused event for the right menu
        // axios get detail, make the structual for current event
        
        retrieveAllForEvent(this.props.setFocusEvent, this.props.logOut, slot.event_id);
        this.props.setRightMenu("Info");
    }

    resizer_mousedown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.rightMenu === "Edit") {
            console.log("hhh");

            this.props.setShowMessage(onEditMessage);
            return;
        }

        let element = e.target.parentNode;
        opacity05([element]);
        let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
        // height_in_progress = original_height_resizer;
        let original_mouse_y = e.clientY;
        let targetSlot = {
            isDragging: false,
            isResizing: true,
            id: element.id,
            event_id: this.props.slot.event_id,
            top: original_y,
            height: original_height,
            original_height: original_height,
            original_y: original_y,
            original_mouse_y: original_mouse_y,
            difference_y: 0,
            minimum_bound: 20,
            maximum_bound: 960,
            length: this.props.slot.length,
            start_time: this.props.slot.start_time,
            event_name: this.props.slot.event_name,
            col_id: this.props.col_id,
            fake_top: original_y,
            fake_height: original_height,
        }
        this.props.setTargetSlot(targetSlot);
        
    };

  render() {
    const {slot, shouldDecorate, focused_event} = this.props;

    let time_array = slot.start_time.split(":");
    let hour = parseInt(time_array[0]);
    let mins = parseInt(time_array[1]);
    let top = hour*40 + (mins/15)*10;
    let height = parseInt(slot.length)/15*10;

    hour = Math.floor(top/40);
    mins = (top%40)/10*15;
    if (mins == 0) mins = "00";
    let start_time = +hour + ":" + mins;

    const eventStyle = {
        top: top + "px",
        height: height + "px",
    };

    if (shouldDecorate) {
        eventStyle.width = "95%";
        eventStyle.boxShadow = "2px 2px 2px 2px #00000055";
        eventStyle.zIndex = "1";  
    }

    return (
    <div id={slot.id} className={"event " + slot.event_id} style={eventStyle} 
    onMouseDown={(e) => this.drager_mousedown(e)}
    // onMouseUp={(e) => this.rightClickUp(e, slot, shouldDecorate, focused_event)}
    onDoubleClick={(e) => this.openInfo(e, slot, shouldDecorate, focused_event)}
    >
        <div className="event-info">
        <div className="event-name-wrapper">
        <div id={"eventName"+slot.id} className="event-name">{slot.event_name}</div>

        </div>
        <div id={"eventTime"+slot.id} className="event-time">{start_time}</div>
        <div id={"eventLength"+slot.id} className="event-length">{slot.length}</div>
        
        </div>
        <div id={"resizer"+slot.id} className="resizer" onMouseDown={this.resizer_mousedown}></div>
    </div>
    )
  }
}

const mapStateToProps = state => {
    console.log("Event");
    console.log(state);
    const focused_event = getFocusEvent(state);
    const hasDefault = getIsDefault(state);
    const targetSlot = getTargetSlot(state);
    const rightMenu = getRightMenu(state);
    return {focused_event, hasDefault, targetSlot, rightMenu};
};


export default connect(mapStateToProps, {logOut, setFocusEvent, setRightMenu, setTargetSlot, setShowMessage})(Event);
