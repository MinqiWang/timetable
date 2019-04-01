import React, { Component } from 'react'
import {dateString} from '../../redux/actions';



export class TimeslotDetailInfo extends Component {
  render() {
    const {slot} = this.props;
    let time = slot.start_time.split(":");
    let hour = +time[0];
    let min = +time[1];
    return (
    <>
        <div>{"Start at: " + slot.start_time}</div>
        <div>{"Length: " + slot.length + " Mins"}</div>
        <div>{"Date: " + dateString(slot.week_of, hour, min, slot.day_of_the_week)}</div>
    </>
    )
  }
}

export default TimeslotDetailInfo
