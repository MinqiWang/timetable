import React, { Component } from 'react';
import {setCurrEvent, setRightMenu, logOut} from '../../redux/actions';
import { connect } from 'react-redux';
import { getCurrentEvent, getDefaultEvent } from '../../redux/selecter';
import '../../style/RightMenu.css';
import Form from 'react-bootstrap/Form';
import {createEvent} from '../../configs/ajax';

export class EditMode extends Component {

    save = (ev) => {
        console.log("save");
        let event_name = document.getElementById("edit-event-name").value;
        let event_desc = document.getElementById("edit-event-text").value;

        let place = "lalal";
        let data = {detail: ["Hello World", "", "UTSC"], timetable_slots: 
 [["event1", true, "8:45:00", "15", "2019-03-17", 1, false]]};
        createEvent(this.props.setCurrEvent, this.props.logOut, data);
    }
    cancel = (ev) => {
        // focusedEvent to null if it is default
        // 
        this.props.setRightMenu("Info");
    }

  render() {
    const {curr_event, default_event} = this.props;
    return (
        <div className="App-rightmenu">
            
            <Form>
                <Form.Group controlId="formEventName">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control id="edit-event-name" type="text" placeholder="Enter an Event Name" 
                    defaultValue={default_event? default_event.Event_Name: curr_event.Event_Name }/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="formEventDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control id="edit-event-text" type="text" placeholder="Description"
                    defaultValue={default_event? "" : curr_event.detail.text} />
                </Form.Group>
                
                {/* {curr_event.timetables.map(slot =>{
                    <Form.Group controlId={"formSlot" + slot.id}>
                    <Form.Label>Time Slots</Form.Label>
                    curr_event
                    <Form.Control id={"edit-slot" + slot.id} type="text" placeholder="Description"
                    defaultValue={default_event? "" : curr_event.detail.text} />
                    </Form.Group>
                })} */}
                
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
    const curr_event = getCurrentEvent(state);
    const default_event = getDefaultEvent(state);

    return {curr_event, default_event};
};


export default connect(mapStateToProps, {setCurrEvent, setRightMenu, logOut})(EditMode);