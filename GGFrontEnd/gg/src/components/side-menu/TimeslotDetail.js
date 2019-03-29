import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import {dateString} from '../../redux/actions'
import { connect } from 'react-redux';
import {setCreateList, setDeleteList, setUpdateList} from '../../redux/actions';
import { getCreateList, getDeleteList, getUpdateList } from '../../redux/selecter';



export class TimeslotDetail extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
       mins: [0, 15, 30],
       isDeleted: false
    }
  }

  componentDidMount() {
    let data = {};
    const {uniqueKey} = this.props;
    let hour = document.getElementById("select-hour"+uniqueKey).value;
    let min = document.getElementById("select-min"+uniqueKey).value;
    let length = document.getElementById("select-length"+uniqueKey).value;
    let repeat = document.getElementById("select-repeat"+uniqueKey).checked;
    let date = document.getElementById("select-date"+uniqueKey).value;
    data = {
      hour: hour,
      mins: min,
      length: length,
      repeat: repeat,
      date: date
    }

    console.log(data);
    this.toUpdateCreateInit(uniqueKey, data);
  }

  toUpdateCreateInit = (uniqueKey, data) => {
    if (!uniqueKey.endsWith("default_slot_ID") && !uniqueKey.startsWith("slot_hold")) {
        this.props.toUpdateList[uniqueKey] = data;
        this.props.setUpdateList(this.props.toUpdateList);
    } else {
      this.props.toCreateList[uniqueKey] = data;
      this.props.setCreateList(this.props.toCreateList);
    }
  }

toUpdateCreate = (e, uniqueKey, property, value) => {
    if (!uniqueKey.endsWith("default_slot_ID") && !uniqueKey.startsWith("slot_hold")) {
        this.props.toUpdateList[uniqueKey][property] = value;
        this.props.setUpdateList(this.props.toUpdateList);
    } else {
        this.props.toCreateList[uniqueKey][property] = value;
        this.props.setCreateList(this.props.toCreateList);
    }
    
}

toDelete = (e, uniqueKey) => {
    e.preventDefault();
    if (!uniqueKey.endsWith("default_slot_ID") && !uniqueKey.startsWith("slot_hold")) {
        
        delete this.props.toUpdateList[uniqueKey];
        let slot_id = uniqueKey.split("$")[1];
        this.props.toDeleteList.push(slot_id);
        this.props.setUpdateList(this.props.toUpdateList);
        this.props.setDeleteList(this.props.toDeleteList);

    } else {
        delete this.props.toCreateList[uniqueKey];
        this.props.setCreateList(this.props.toCreateList);
    }
    // let slot_hold = Object.assign(this.state.slot_hold);
}

  change = (ev, property, control_id) => {
    // ev.preventDefault();
    let value = (property === "repeat")? document.getElementById(control_id).checked : document.getElementById(control_id).value;
    this.toUpdateCreate(ev, this.props.uniqueKey, property, value);
  }

  toDeleteSlot = (ev) => {
    ev.preventDefault();
    this.toDelete(ev, this.props.uniqueKey);
    // cancel the view
    this.setState({isDeleted: true});
  }
  
  render() {
    const {slot, toDelete, uniqueKey} = this.props;
    const {mins, isDeleted} = this.state;
    let time = slot? slot.start_time.split(":") : ["", ""];
    let hour = +time[0];
    let min = +time[1];
    let date_string = slot? dateString(slot.week_of, hour, min, slot.day_of_the_week): "0000-00-00";
    let length = slot? slot.length : "60";
    let repeat_check = (slot && slot.id !== "default_slot_ID")?
    (slot.is_repeating? 
    <Form.Check
      id = {"select-repeat"+uniqueKey}
      type="checkbox"
      name="repeat"
      label="per week"
      disabled
      checked
      onChange={(e) => {this.change(e, "repeat", "select-repeat"+uniqueKey);}}
    /> : 
    <Form.Check
      id = {"select-repeat"+uniqueKey}
      type="checkbox"
      name="repeat"
      label="per week"
      disabled
      onChange={(e) => {this.change(e, "repeat", "select-repeat"+uniqueKey);}}
    />) : 
    <Form.Check
      id = {"select-repeat"+uniqueKey}
      type="checkbox"
      name="repeat"
      label="per week"
      onChange={(e) => {this.change(e, "repeat", "select-repeat"+uniqueKey);}}
    />
    let deleteButton = <button onClick={(e) => this.toDeleteSlot(e, toDelete)}>delete above timeslot</button>;
    if (!isDeleted) {
      return (
        <>
        <Form.Row>
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Hour</Form.Label>
              <Form.Control id={"select-hour"+uniqueKey} as="select"  
              placeholder="Hour"
              defaultValue={hour}
              onChange={(e) => {this.change(e, "hour", "select-hour"+uniqueKey);}}
              // onChange={(e) => console.log("changed")}
              >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              </Form.Control>
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Mins</Form.Label>
              <Form.Control as="select" id={"select-min"+uniqueKey} placeholder="Min"
              defaultValue={min}
              onChange={(e) => {this.change(e, "mins", "select-min"+uniqueKey);}}
              // onChange={(e) => console.log("changed")}              
              >
              {mins.map(min => <option key={min} value={+min}>{min}</option>)}
              </Form.Control>
  
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Length</Form.Label>
              <Form.Control id={"select-length"+uniqueKey} type="text" placeholder="Mins"
              defaultValue={length} 
              onChange={(e) => {this.change(e, "length", "select-length"+uniqueKey);}}
              // onChange={(e) => console.log("changed")}
              />
  
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="validationFormik04">
              {repeat_check}
              {/* <Form.Control.Feedback type="invalid">
                  {errors.repeat}
              </Form.Control.Feedback> */}
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationFormik05">
              <Form.Label>Date</Form.Label>
              <Form.Control
                  id = {"select-date"+uniqueKey}
                  type="text"
                  placeholder="YYYY-MM-DD"
                  name="date"
                  defaultValue={date_string}
                  onChange={(e) => {this.change(e, "date", "select-date"+uniqueKey);}}
                  // onChange={(e) => console.log("changed")}

                  // onChange={handleChange}
                  // isInvalid={!!errors.zip}
              />
  
              {/* <Form.Control.Feedback type="invalid">
                  {errors.zip}
              </Form.Control.Feedback> */}
          </Form.Group>
      </Form.Row>
      {deleteButton}
      </>
      )
    } else {
      return null;
    }
    
  }
}

const mapStateToProps = state => {
  console.log("TimeslotDetail");
  console.log(state);
  const toCreateList = getCreateList(state);
  const toDeleteList = getDeleteList(state);
  const toUpdateList = getUpdateList(state);

  return {toCreateList, toDeleteList, toUpdateList};
};

export default connect(mapStateToProps, {setCreateList, setDeleteList, setUpdateList})(TimeslotDetail);

