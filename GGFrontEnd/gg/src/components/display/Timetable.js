import React, { Component } from 'react'
import '../../style/Timetable.css';
import DayColumn from './DayColumn';
import {setCurrEvent, setRightMenu, setDefaultEvent, setSlots} from '../../redux/actions'
import { connect } from 'react-redux';
import { getDefaultEvent } from '../../redux/selecter';
import { retrieveAllSlotsInAWeek } from '../../configs/ajax';

export class Timetable extends Component {
  constructor(props) {
    super(props)
    let date = new Date();
    let now = date.getTime();
    let dayOfWeek = date.getDay();
    let weekOfDate = new Date(now - 86400000*dayOfWeek);
    let week_of = weekOfDate.toISOString().split('T')[0];
    retrieveAllSlotsInAWeek(this.props.setSlots, week_of);
    this.state = {
       time_tag: [],
       days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
       slots: {"Sun": [{SLOT_ID: "slot_a", EVENT_ID: "a", EVENT_NAME: "hello world", EVENT_HAS_DETAIL: false, START_TIME: "18:45:00", LENGTH: "120", WEEK_OF: "2019-03-17", DAY_OF_THE_WEEK: 0, IS_REPEATING: false, 
       OBSCURED_BY: null, IS_EMPTY_OBSCURE: null}], "Mon": [], 
       "Tue": [], "Wed": [], "Thu": [], "Fri":[], "Sat":[]}
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
  
  render() {
    const {time_tag, days, slots} = this.state;
    const {default_event} = this.props;
    console.log(slots["Sun"]);
    console.log(default_event);
    return (
      <div className="Timetable-top-wrapper">
      <div className="Timetable-wrapper">
      <div className="Timetable">
        <div className="Timetable-header">
          <button>prev week</button>
          <button>next week</button>
          <div>this week</div>
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
  console.log(default_event);
  return {default_event};
};

export default connect(mapStateToProps, {})(Timetable);
