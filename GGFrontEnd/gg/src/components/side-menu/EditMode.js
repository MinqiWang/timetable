import React, { Component, Fragment } from 'react';
import {setRightMenu, logOut, setFocusEvent, weekOf, toDate, dayOfWeek, setSlots, setCreateList, resetToDoList, isNotDefault} from '../../redux/actions';
import { connect } from 'react-redux';
import { getIsDefault, getCreateList, getDeleteList, getUpdateList, getWeekOf } from '../../redux/selecter';
import '../../style/RightMenu.css';
import Form from 'react-bootstrap/Form';
import TimeslotDetail from './TimeslotDetail';
import {createEvent, saveEvent, retrieveAllSlotsInAWeek} from '../../RESTFul/ajax'

export class EditMode extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        slot_hold: [],
      }
    }

    save = (ev) => {
        ev.preventDefault();
        console.log("save");
        let event_name = document.getElementById("edit-event-name").value;
        let event_desc = document.getElementById("edit-event-text").value;
        let event_place = document.getElementById("edit-event-place").value;
        let event_media = document.getElementById("edit-event-media").value;

        const {toCreateList, toUpdateList, toDeleteList, 
            setSlots, logOut, focused_event, week_of, is_Default, 
            setFocusEvent, isNotDefault,
            resetToDoList, setRightMenu} = this.props;

        //pre-work to fit the data
        let to_create = [];
        let to_update = [];
        for (let [key, value] of Object.entries(toCreateList)) {
            console.log(key, value);

            // validationChecking

            // data looks fine
            let create_slot = [];
            create_slot.push(event_name);
            create_slot.push(true);
            if (value.mins == "0") value.mins = "00"
            create_slot.push(value.hour + ":" + value.mins + ":00");
            create_slot.push(value.length);

            let d = toDate(value.date, value.hour, value.mins);
            let day_of_week = d.getDay();
            create_slot.push(weekOf(d));// week_of
            create_slot.push(day_of_week);// day_of_week
            create_slot.push(value.repeat);// repeat
            to_create.push(create_slot);
        }
        for (let [key, value] of Object.entries(toUpdateList)) {
            // validationChecking

            // data looks fine
            let update_slot = [];
            update_slot.push(event_name);
            if (value.mins == "0") value.mins = "00";
            update_slot.push(value.hour + ":" + value.mins + ":00");
            update_slot.push(value.length);

            let d = toDate(value.date, value.hour, value.mins);
            let day_of_week = d.getDay();

            update_slot.push(weekOf(d));// week_of
            update_slot.push(day_of_week);// day_of_week
            update_slot.push(+key.split("$")[1]);// slot_id of slot need updating
            
            to_update.push(update_slot);
        }
        
        let toSend =
        {
           "detail_info": [event_desc, event_media, event_place],
           "to_create": 
           to_create,
           "to_update":to_update,
           "to_delete":
           toDeleteList
        }

        if (is_Default) {
            let data = {
                detail: [event_desc, event_media, event_place],
                timetable_slots: to_create
            }
            // need to reset focus event, set RightMenu to Close, reset isDefault, reset toDolist
            createEvent(function(res) {
                setFocusEvent();
                isNotDefault();
                resetToDoList();
                setRightMenu("Close");
                retrieveAllSlotsInAWeek(setSlots, logOut, week_of);
            }, logOut, data);
        } else {
            // need to reset focus event, set RightMenu to Close, reset isDefault, reset toDolist
            saveEvent(function(res) {
                setFocusEvent();
                isNotDefault();
                setRightMenu("Close");
                resetToDoList();
                retrieveAllSlotsInAWeek(setSlots, logOut, week_of);
            }.bind(this), logOut, focused_event.detail.id, toSend);
            console.log(toSend);
       }
    }

    cancel = (ev) => {
        ev.preventDefault();
        if (this.props.is_Default) {
            this.props.resetToDoList();
            this.props.setFocusEvent();
            this.props.isNotDefault();
            this.props.setRightMenu("Close");
        } else {
            this.props.setRightMenu("Info");
            this.props.resetToDoList();
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
                    defaultValue={focused_event.detail.event_name}/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group controlId="formEventDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control id="edit-event-text" type="text" placeholder="Description"
                    defaultValue={focused_event.detail.text_content} />
                </Form.Group>

                {days.map(day => 
                <Fragment key={day}>{focused_event.timetable_slots[day].map(slot=>
                    <TimeslotDetail key={slot.id} slot={slot} uniqueKey={"slot$" + slot.id} focused_event={focused_event} 
                    />)
                }</Fragment>
                )}
                
                {slot_hold.map((item, index) => <TimeslotDetail key={"slot_hold$" + index} uniqueKey={"slot_hold" + index} 
                />)}   
            
                <button onClick={this.addSlot}>add slot</button>

                <Form.Group controlId="formEventPlace">
                    <Form.Label>Place</Form.Label>
                    <Form.Control id="edit-event-place" type="text" placeholder="Place"
                    defaultValue={focused_event.detail.place} />
                </Form.Group>

                <Form.Group controlId="formEventMedia">
                    <Form.Label>Image</Form.Label>
                    <Form.Control id="edit-event-media" type="text" placeholder="Media"
                    defaultValue={focused_event.detail.media_content_urls} />
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
    const is_Default = getIsDefault(state);
    const toCreateList = getCreateList(state);
    const toDeleteList = getDeleteList(state);
    const toUpdateList = getUpdateList(state);
    const week_of = getWeekOf(state);
    return {is_Default, week_of, toCreateList, toDeleteList, toUpdateList};
};


export default connect(mapStateToProps, {setFocusEvent, setRightMenu, logOut, setSlots, resetToDoList, isNotDefault})(EditMode);