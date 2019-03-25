import React, { Component } from 'react';
import {setFocusEvent, setRightMenu, isNotDefault, setTargetSlot} from '../../redux/actions'
import { connect } from 'react-redux';
import { getFocusEvent, getIsDefault } from '../../redux/selecter';
import {decorate, undecorate} from '../../utils'

export class Event extends Component {

constructor(props) {
  super(props)

  this.drager_mousedown = this.drager_mousedown.bind(this);
  this.resizer_mousedown = this.resizer_mousedown.bind(this);
  

  let time_array = this.props.slot.start_time.split(":");
    let hour = parseInt(time_array[0]);
    let mins = parseInt(time_array[1]);
    let top = hour*40 + (mins/15)*10;

    let height = parseInt(this.props.slot.length)/15*10;
  this.state = {
      top: top,
      height: height,
  }
}

drager_mousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let element = e.target;
    decorate([element]);
    let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
    
    let difference_y = e.clientY - original_y;
    console.log("setDifferece");
    console.log(e.clientY);
    let targetSlot = {
        isDragging: true,
        isResizing: false,
        id: element.id,
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
    let element = e.target.parentNode;
    decorate([element]);
    console.log(element);
    let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    let original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
    // height_in_progress = original_height_resizer;
    let original_mouse_y = e.clientY;
    let targetSlot = {
        isDragging: false,
        isResizing: true,
        id: element.id,
        original_height: original_height,
        original_y: original_y,
        original_mouse_y: original_mouse_y,
        difference_y: 0,
        minimum_bound: 10,
        maximum_bound: 960
    }
    this.props.setTargetSlot(targetSlot);
    
};

  render() {
    const {slot, shouldDecorate, focused_event} = this.props;
    const {top, height} = this.state;
    console.log(slot);
    console.log(shouldDecorate);

    let hour = Math.floor(top/40);
    let mins = (top%40)/10*15;
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
        {/* <div id={"draggable"+slot.id} className="draggable" > */}
        {/* <div>{slot.event_name}</div>
        <div>{start_time}</div> */}
        
        {/* </div> */}
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
    return {focused_event, hasDefault};
};


export default connect(mapStateToProps, {setFocusEvent, setRightMenu, setTargetSlot})(Event);
