import React, { Component } from 'react'
import '../../style/Timetable.css';
import DayColumn from './DayColumn';
import {setCurrEvent, setRightMenu, setDefaultEvent, setSlots, setWeekOf, logOut} from '../../redux/actions'
import { connect } from 'react-redux';
import { getDefaultEvent, getWeekOf } from '../../redux/selecter';
import { retrieveAllSlotsInAWeek } from '../../configs/ajax';
import {weekOfFromMilliSec} from '../../redux/actions'

export class Timetable extends Component {
  constructor(props) {
    super(props)
    
    retrieveAllSlotsInAWeek(this.props.setSlots, this.props.logOut, this.props.week_of);
    this.state = {
       time_tag: [],
       days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
       slots: {"Sun": [{SLOT_ID: "slot_a", EVENT_ID: "a", EVENT_NAME: "hello world", EVENT_HAS_DETAIL: false, START_TIME: "18:45:00", LENGTH: "120", WEEK_OF: "2019-03-17", DAY_OF_THE_WEEK: 0, IS_REPEATING: false, 
       OBSCURED_BY: null, IS_EMPTY_OBSCURE: null}], "Mon": [], 
       "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]},
       week_num: 0
    }
  }

  componentDidMount() {
    let time_tag = [];
    let start = ":00 - "
    let end = ":59"
    for (let i = 0; i < 24; i++) {
      let time = +i + start + i + end;
      let time_obj = {};
      time_obj.time = time;
      time_obj.ID = i;
      time_tag.push(time_obj);
    }
    this.setState({time_tag: time_tag});
  }

  prev = (ev) => {
    // let show_week = new Date(this.props.week_of);
    // console.log(this.props.week_of);
    // let offset = (new Date()).getTimezoneOffset()*60*1000;
    // console.log(offset);
    let week_num = this.state.week_num - 1;
    let week_of = weekOfFromMilliSec(week_num);
    retrieveAllSlotsInAWeek(this.props.setSlots, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: week_num});
    
  }
  
  next = (ev) => {
    // let show_week = new Date(this.props.week_of);
    // console.log(this.props.week_of);
    // let offset = (new Date()).getTimezoneOffset()*60*1000;
    // this.props.setWeekOf(weekOfFromMilliSec(show_week.getTime() + offset + 86400000*7));
    let week_num = this.state.week_num + 1;
    let week_of = weekOfFromMilliSec(week_num);
    retrieveAllSlotsInAWeek(this.props.setSlots, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: week_num});
  }

  today = (ev) => {
    console.log(this.props.week_of);
    let week_of = weekOfFromMilliSec();
    retrieveAllSlotsInAWeek(this.props.setSlots, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: 0});
  }

  render() {
    const {time_tag, days, slots} = this.state;
    const {default_event, week_of} = this.props;
    console.log(slots["Sun"]);
    console.log(default_event);
    return (
      <div className="Timetable-top-wrapper">
      <div className="Timetable-wrapper">
      <div className="Timetable">
        <div className="Timetable-header">
          <div className="Timetable-navbtn">
            <button onClick={this.prev}>prev week</button>
            <button onClick={this.next}>next week</button>
            <button onClick={this.today}>Today</button>
          </div>
          
          <div className="Timetable-week">{week_of}</div>
        </div>
        <div className="Timetable-scroll">
          <ul className="time-tag">
            {time_tag.map(time_obj =>
              <li key={time_obj.ID}>{time_obj.time}</li>)}
          </ul>
          <div className="scroll-slots">
              <div className="scroll-slots-col1"></div>
                {days.map(day => <DayColumn key={day} col_id={day} slots={slots[day]} default_slots={default_event.timetable_slots[day]}></DayColumn>)}
              {/* <div id="col3" className="scroll-slots-col">Mon</div>
              <div id="col4" className="scroll-slots-col">Tue</div>
              <div id="col5" className="scroll-slots-col">Wed</div>
              <div id="col6" className="scroll-slots-col">Thu</div>
              <div id="col7" className="scroll-slots-col">Fri</div>
              <div id="col8" className="scroll-slots-col">Sat</div> */}
              <div className="scroll-slots-col scroll-slots-col1"></div>
          </div>
        </div>
      </div>
      </div>
      </div>   
    )
  }
}

const mapStateToProps = state => {
  const default_event = getDefaultEvent(state);
  const week_of = getWeekOf(state);
  console.log(week_of);
  return {default_event, week_of};
};

export default connect(mapStateToProps, {setWeekOf, logOut})(Timetable);
