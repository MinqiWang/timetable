import React, { Component } from 'react';
import {setFocusEvent, setRightMenu, isNotDefault, setTargetSlot, setShowMessage} from '../../redux/actions'
import { connect } from 'react-redux';
import { getFocusEvent, getIsDefault, getTargetSlot, getRightMenu } from '../../redux/selecter';
import {decorate, undecorate} from '../../utils'
import {onEditMessage, onSaveMessage} from '../../redux/reducers/message'

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
    if (this.props.rightMenu == "Edit") {
        console.log("hhh");
        this.props.setShowMessage(onEditMessage);
        return;
    }
    let element = e.currentTarget;
    decorate([element]);
    let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
    
    let difference_y = e.clientY - original_y;
    let targetSlot = {
        isDragging: true,
        isResizing: false,
        id: element.id,
        top: original_y,
        height: original_height,
        original_height: original_height,
        original_y: 0,
        original_mouse_y: 0,
        difference_y: difference_y,
        minimum_bound: 0,
        maximum_bound: 960,
    }

    this.props.setTargetSlot(targetSlot);
    // save needed value or info of this event to redux, set isDragging
};

drager_dblclick = (e, slot, isDefault, focused_event) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.rightMenu == "Edit") {
        console.log("hhh");
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
    // this.props.setFocusEvent(slot);
    this.props.setRightMenu("Info");

}

resizer_mousedown = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.rightMenu == "Edit") {
        console.log("hhh");

        this.props.setShowMessage(onEditMessage);
        return;
    }
    let element = e.target.parentNode;
    decorate([element]);
    let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
    // height_in_progress = original_height_resizer;
    let original_mouse_y = e.clientY;
    let targetSlot = {
        isDragging: false,
        isResizing: true,
        id: element.id,
        top: original_y,
        height: original_height,
        original_height: original_height,
        original_y: original_y,
        original_mouse_y: original_mouse_y,
        difference_y: 0,
        minimum_bound: 20,
        maximum_bound: 960
    }
    this.props.setTargetSlot(targetSlot);
    
};

  render() {
    const {slot, shouldDecorate, focused_event, targetSlot} = this.props;
    let {top, height} = this.state;

    let time_array = slot.start_time.split(":");
    let hour = parseInt(time_array[0]);
    let mins = parseInt(time_array[1]);
    top = hour*40 + (mins/15)*10;
    height = parseInt(slot.length)/15*10;

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

    //if isDragging and slot.id == targetSlot.id, do not render

    return (
    <div id={slot.id} className={"event " + slot.event_id} style={eventStyle} 
    onMouseDown={(e) => this.drager_mousedown(e)}
    onDoubleClick={(e) => this.drager_dblclick(e, slot, shouldDecorate, focused_event)}>
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


export default connect(mapStateToProps, {setFocusEvent, setRightMenu, setTargetSlot, setShowMessage})(Event);
