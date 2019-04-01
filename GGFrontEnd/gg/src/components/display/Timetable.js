import React, { Component } from 'react'
import '../../style/Timetable.css';
import DayColumn from './DayColumn';
import { setSlots, setAcceptSlots, setWeekOf, logOut, setShowMessage} from '../../redux/actions'
import { connect } from 'react-redux';
import { getWeekOf, getAcceptSlots, getSlots, getFocusEvent, getIsDefault, getRightMenu } from '../../redux/selecter';
import { retrieveAllSlotsInAWeek, retrieveAcceptedInAWeek } from '../../RESTFul/ajax';
import {weekOf} from '../../redux/actions'
import {onEditMessage, onSaveMessage, ErrorMessage} from '../../redux/reducers/message'


export class Timetable extends Component {
  constructor(props) {
    super(props)
    const {setShowMessage} = this.props;
    retrieveAllSlotsInAWeek(this.props.setSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, this.props.week_of);
    retrieveAcceptedInAWeek(this.props.setAcceptSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, this.props.week_of);
    this.state = {
       time_tag: [],
       days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
    const {setShowMessage} = this.props;
    if (this.props.rightMenu === "Edit") {
      setShowMessage(onEditMessage);
      return;
    }
    let week_num = this.state.week_num - 1;
    let week_of = weekOf(new Date(), week_num);
    retrieveAllSlotsInAWeek(this.props.setSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: week_num});
    
  }
  
  next = (ev) => {
    const {setShowMessage} = this.props;
    if (this.props.rightMenu === "Edit") {
      setShowMessage(onEditMessage);
      return;
    }
    let week_num = this.state.week_num + 1;
    let week_of = weekOf(new Date(), week_num);
    retrieveAllSlotsInAWeek(this.props.setSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: week_num});
  }

  today = (ev) => {
    const {setShowMessage} = this.props;
    if (this.props.rightMenu === "Edit") {
      setShowMessage(onEditMessage);
      return;
    }
    let week_of = weekOf(new Date());
    retrieveAllSlotsInAWeek(this.props.setSlots, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, week_of);
    this.props.setWeekOf(week_of);
    this.setState({week_num: 0});
  }

  render() {
    const {time_tag, days} = this.state;
    const {focused_event, week_of, slots, isDefault, accept_slots} = this.props;
    const eventTypeStyle1 = {
      background: "red",
      display: "inline-block"
  };
    const eventTypeStyle2 = {
      background: "white",
      display: "inline-block"

    };
    const eventTypeStyle3 = {
      background: "yellow",
      display: "inline-block"
    };

    const textStyle4 = {
      display: "inline-block",
      width: "50px",
      fontSize: "10px",
      wordWrap: "break-word",
      marginLeft: "5px",
      marginRight: "5px"
    };

    const btnStyle = {
      width: "34px",
    };

    return (
      <div className="Timetable-top-wrapper">
      <div className="Timetable-wrapper">
      <div className="Timetable">
        <div className="Timetable-header">
          <div className="Timetable-navbtn">
            <button onClick={this.prev} style={btnStyle}>prev week</button>
            <button onClick={this.next} style={btnStyle}>next week</button>
            <button onClick={this.today} style={btnStyle}>this week</button>
          </div>
          
          <div className="Timetable-week">
            <div className="badgeEvent">
              <div className = "event-badge" style={eventTypeStyle1}></div>
                <div style={textStyle4} >Accpeted Event</div>
                <div className = "event-badge" style={eventTypeStyle2}></div>
                <div style={textStyle4} >Private Event</div>

                <div className = "event-badge" style={eventTypeStyle3}></div>
                <div style={textStyle4} >My Group Event</div>
            </div>
            

          {week_of}
          </div>
        </div>
        <div className="Timetable-scroll">
          <ul className="time-tag">
            {time_tag.map(time_obj =>
              <li key={time_obj.ID}>{time_obj.time}</li>)}
          </ul>
          <div className="scroll-slots" onMouseLeave={this.solidifyEvent}>
              <div className="scroll-slots-col1"></div>
                {days.map((day, index)=> <DayColumn week_of={week_of} key={day} indice={index} col_id={day} slots={slots[day]} accept_slots={accept_slots[day]} default_slots={isDefault? focused_event.timetable_slots[day]: []}></DayColumn>)}
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
  const focused_event = getFocusEvent(state);
  const week_of = getWeekOf(state);
  const slots = getSlots(state);
  const accept_slots = getAcceptSlots(state);

  const isDefault = getIsDefault(state);
  const rightMenu = getRightMenu(state);

  return {focused_event, week_of, slots, isDefault, rightMenu, accept_slots};
};

export default connect(mapStateToProps, {setWeekOf, setAcceptSlots, logOut, setSlots,setShowMessage})(Timetable);
