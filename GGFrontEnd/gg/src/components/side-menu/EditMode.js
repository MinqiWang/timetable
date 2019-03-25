import React, { Component, Fragment } from 'react';
import {setRightMenu, logOut, setFocusEvent} from '../../redux/actions';
import { connect } from 'react-redux';
import { getIsDefault } from '../../redux/selecter';
import '../../style/RightMenu.css';
import Form from 'react-bootstrap/Form';
import {createEvent} from '../../configs/ajax';
import TimeslotDetail from './TimeslotDetail';

export class EditMode extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        slot_hold: []
      }
    }
    

    save = (ev) => {
        console.log("save");
        let event_name = document.getElementById("edit-event-name").value;
        let event_desc = document.getElementById("edit-event-text").value;

        let place = "lalal";

        //get the values from redux Ready_to_Send_Event;

        let data = {detail: ["Hello World", "", "UTSC"], timetable_slots: 
 [["event1", true, "8:45:00", "15", "2019-03-17", 1, false]]};
        createEvent(this.props.setFocusEvent, this.props.logOut, data);
    }
    cancel = (ev) => {
        if (this.props.isDefault) {
            this.props.setFocusEvent();
            this.props.setRightMenu("Close");
        } else {
            this.props.setRightMenu("Info");
        }
    }

    addSlot = (ev) => {
        ev.preventDefault();
        // let slot_hold = Object.assign(this.state.slot_hold);
        this.state.slot_hold.push(1);
        // slot_hold.push(1);
        // console.log(slot_hold.length);
        this.setState(this.state.slot_hold);
    }

  render() {
    const {focused_event} = this.props;
    const {days, slot_hold} = this.state;
    return (
        <div className="App-rightmenu">
            <div className="Nav-Btns">
                <button onClick={this.save}>save</button>
                <button onClick={this.cancel}>cancel</button>
            </div>
            <Form>
                
                <Form.Group controlId="formEventName">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control id="edit-event-name" type="text" placeholder="Enter an Event Name" 
                    defaultValue={focused_event.event_name}/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="formEventDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control id="edit-event-text" type="text" placeholder="Description"
                    defaultValue={focused_event.detail[0]} />
                </Form.Group>

                {days.map(day => 
                <Fragment key={day}>{focused_event.timetable_slots[day].map(slot=>
                    <TimeslotDetail key={slot.id} slot={slot} focused_event={focused_event}/>)
                }</Fragment>
                )}
                
                {slot_hold.map((item, index) => <TimeslotDetail key={index}/>)}   
            
                <button onClick={this.addSlot}>add slot</button>

                <Form.Group controlId="formEventPlace">
                    <Form.Label>Place</Form.Label>
                    <Form.Control id="edit-event-place" type="text" placeholder="Place"
                    defaultValue={focused_event.detail[1]} />
                </Form.Group>

                <Form.Group controlId="formEventMedia">
                    <Form.Label>Image</Form.Label>
                    <Form.Control id="edit-event-media" type="text" placeholder="Media"
                    defaultValue={focused_event.detail[2]} />
                </Form.Group>                
            </Form>
            <div className="Nav-Btns">
                <button onClick={this.save}>save</button>
                <button onClick={this.cancel}>cancel</button>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
    console.log("Edit");
    console.log(state);
    const isDefault = getIsDefault(state);
    return {isDefault};
};


export default connect(mapStateToProps, {setFocusEvent, setRightMenu, logOut})(EditMode);