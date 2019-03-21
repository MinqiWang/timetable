import React, { Component } from 'react';
import {setFocusEvent, setRightMenu} from '../../redux/actions'
import { connect } from 'react-redux';
import { getFocusEvent } from '../../redux/selecter';

export class Event extends Component {

constructor(props) {
  super(props)
  this.state = {
  }
}

componentDidMount() {
    let {slot, col_id, setFocusEvent, setRightMenu, focused_event} = this.props;
    this.makeEventListener(slot.id, col_id, slot, focused_event, setFocusEvent, setRightMenu);
}

componentDidUpdate() {
    let {slot, col_id, setFocusEvent, setRightMenu, focused_event} = this.props;
    this.makeEventListener(slot.id, col_id, slot, focused_event, setFocusEvent, setRightMenu);
}

makeEventListener(id, col_id, slot, focused_event, setFocusEvent, setRightMenu) {
    const element = document.getElementById(id);
    const resizer = document.querySelector('#resizer' + id);
    const container = document.querySelector('#' + col_id);
    const drager = document.querySelector('#draggable' + id);

    const minimum_bound = 0;
    const minimum_bound_resizer = 10;
    const maximum_bound = 960;

    let original_height = 0;
    let original_y = 0;
    let difference_y = 0;
    
    let original_y_resizer = 0;
    let original_height_resizer = 0;
    let original_mouse_y = 0;
    let height_in_progress = 0;

    drager.addEventListener('mousedown', function(e) {
        e.preventDefault();
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
        difference_y = e.y - original_y;
        container.addEventListener('mousemove', adjust);
        container.addEventListener('mouseup', stopAdjust);
        container.addEventListener('mouseleave', stopAdjust);
    })

    drager.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (focused_event) {
            undecorate(Array.from(document.querySelectorAll('.' + focused_event.event_id)));
        }
        container.removeEventListener('mouseleave', stopAdjust);
        decorate(Array.from(document.querySelectorAll('.' + slot.event_id)));
        //set the elmt to be the current focused event for the right menu
        // axios get detail, make the structual for current event
        // setFocusEvent(slot);
        setRightMenu("Info");
    })
      
    function adjust(e) {
        e.preventDefault();
        decorate([element]);
        let temp_top = (e.y - difference_y);
        let max_top = Math.ceil(temp_top/10)*10;
        let min_top = Math.floor(temp_top/10)*10;

        if ((temp_top % 10) > 5 
        && (original_y !== max_top) 
        && (max_top + original_height) <= maximum_bound) {
            original_y = max_top;
            element.style.top = max_top + 'px';
        } else if ((temp_top % 10) <= 5 
        && (original_y !== min_top) 
        && min_top >= minimum_bound 
        && (min_top + original_height) <= maximum_bound) {
            original_y = min_top;
            element.style.top = min_top + 'px';
        }
    }

    function decorate(elements) {
        elements.map(element => {
            element.style.width = "95%";
            element.style.boxShadow = "2px 2px 2px 2px #00000055";
            element.style.zIndex = "1";
        })
    }

    function undecorate(elements) {
        elements.map(element=>{
            element.style.width = "90%";
            element.style.boxShadow = "";
            element.style.zIndex = "0";
        })
    }

    function stopAdjust() {
        container.removeEventListener('mousemove', adjust);
        undecorate([element]);
    // do save
    }

    resizer.addEventListener('mousedown', function(e) {
        e.preventDefault()
        decorate([element]);
        original_height_resizer = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_y_resizer = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
        height_in_progress = original_height_resizer;
        original_mouse_y = e.y;
        container.addEventListener('mousemove', resize);
        container.addEventListener('mouseup', stopResize);
        container.addEventListener('mouseleave', stopResize);
    })
    function resize(e) {
        let add_height = e.y - original_mouse_y;
        let right_add_height = Math.ceil(add_height/10)*10;
        let temp_height = original_height_resizer + right_add_height;
        if ((temp_height !== height_in_progress) 
        && (temp_height >= minimum_bound_resizer) 
        && ((original_y_resizer + temp_height) <= maximum_bound)) {
            height_in_progress = temp_height;
            element.style.height = temp_height + 'px';
        }
      }

      function stopResize() {
        container.removeEventListener('mousemove', resize);
        undecorate([element]);
        // do save
      }
  }

  render() {
    const {slot, shouldDecorate} = this.props;
    console.log(slot);
    console.log(shouldDecorate);

    let time_array = slot.start_time.split(":");
    let bar = parseInt(time_array[0]);
    let index = parseInt(time_array[1]);
    let top = bar*40 + (index/15)*10;

    let height = parseInt(slot.length)/15*10;

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
    <div id={slot.id} className={"event " + slot.event_id} style={eventStyle}>
        <div id={"draggable"+slot.id} className="draggable"></div>
        <div id={"resizer"+slot.id} className="resizer"></div>
    </div>
    )
  }
}

const mapStateToProps = state => {
    console.log("Event");
    console.log(state);
    const focused_event = getFocusEvent(state);
    return {focused_event};
};


export default connect(mapStateToProps, {setFocusEvent, setRightMenu})(Event);
