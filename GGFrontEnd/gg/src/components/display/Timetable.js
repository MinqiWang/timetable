import React, { Component } from 'react'
import '../../style/Timetable.css';

export class Timetable extends Component {
  constructor(props) {
    super(props)
    this.state = {
       time_tag: []
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
    const {time_tag} = this.state;
    return (
      <div className="Timetable-wrapper">
      <div className="Timetable">
        <div className="Timetable-header">
          title
        </div>
        <div className="Timetable-scroll">
            <ul className="time-tag">
              {time_tag.map(time_obj =>
                <li key={time_obj.ID}>{time_obj.time}</li>)}
            </ul>
          <div className="scroll-slots">
              <div className="scroll-slots-col1"></div>
              <div id="col2" className="scroll-slots-col"><button>adfada</button></div>
              <div id="col3" className="scroll-slots-col">Mon</div>
              <div id="col4" className="scroll-slots-col">Tue</div>
              <div id="col5" className="scroll-slots-col">Wed</div>
              <div id="col6" className="scroll-slots-col">Thu</div>
              <div id="col7" className="scroll-slots-col">Fri</div>
              <div id="col8" className="scroll-slots-col">Sat</div>
              <div className="scroll-slots-col scroll-slots-col1"></div>
          </div>
        </div>
      </div>
      </div>     
    )
  }
}

export default Timetable
