import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import {dateString} from '../../redux/actions'


export class TimeslotDetail extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       mins: [0, 15, 30],
       isDeleted: false
    }
  }

  componentDidMount() {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    this.setState({hours});
  }

  deleteEvent = ev => {
    ev.preventDefault();
    this.setState({isDeleted: true});
  }
  
  render() {
    const {slot} = this.props;
    const {mins, isDeleted} = this.state;
    let time = slot? slot.start_time.split(":") : ["", ""];
    let hour = +time[0];
    let min = +time[1];
    console.log(hour);
    console.log(min);
    let date_string = slot? dateString(slot.week_of, hour, min, slot.day_of_the_week): "";
    let length = slot? slot.length : "";

    let deleteButton = slot? null : <button onClick={this.deleteEvent}>delete above timeslot</button>;
    if (!isDeleted) {
      return (
        <>
        {}
        <Form.Row>
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Hour</Form.Label>
              <Form.Control as="select"  placeholder="Hour"
              defaultValue={hour}>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
              <option>13</option>
              <option>14</option>
              <option>15</option>
              <option>16</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
              <option>21</option>
              <option>22</option>
              <option>23</option>
              </Form.Control>
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Mins</Form.Label>
              <Form.Control as="select" id="edit-event-min" placeholder="Min"
              defaultValue={min}>
              {mins.map(min => <option key={min}>{min}</option>)}
              </Form.Control>
  
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="formEventTime">
              <Form.Label>Length</Form.Label>
              <Form.Control id="edit-event-media" type="text" placeholder="Mins"
              defaultValue={length} />
  
              {/* <Form.Control.Feedback type="invalid">
                  {errors.time}
              </Form.Control.Feedback> */}
          </Form.Group>
  
          <Form.Group as={Col} md="2" controlId="validationFormik04">
              <Form.Check
                  type="checkbox"
                  name="repeat"
                  label="per week"
                  // onChange={handleChange}
                  // isInvalid={!!errors.state}
              />
              {/* <Form.Control.Feedback type="invalid">
                  {errors.repeat}
              </Form.Control.Feedback> */}
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationFormik05">
              <Form.Label>Date</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="YYYY-MM-DD"
                  name="date"
                  defaultValue={date_string}
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

export default TimeslotDetail

