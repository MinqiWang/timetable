import React, { Component } from 'react';
import {setRightMenu, logOut, setFocusEvent} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFocusEvent, getIsDefault } from '../../redux/selecter';
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

  render() {
    const {focusedEvent} = this.props;
    return (
        <div className="App-rightmenu">
            
            <Form>
                <Form.Group controlId="formEventName">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control id="edit-event-name" type="text" placeholder="Enter an Event Name" 
                    defaultValue={focusedEvent.event_name}/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="formEventDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control id="edit-event-text" type="text" placeholder="Description"
                    defaultValue={focusedEvent.detail[0]} />
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
    const focusedEvent = getFocusEvent(state);
    const isDefault = getIsDefault(state);

    return {focusedEvent, isDefault};
};


export default connect(mapStateToProps, {setFocusEvent, setRightMenu, logOut})(EditMode);