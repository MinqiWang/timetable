import React, { Component } from 'react';
import {setFocusEvent, setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFocusEvent } from '../../redux/selecter';
import '../../style/RightMenu.css';
import {deleteEvent} from '../../configs/ajax'

export class InfoMode extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
      }
    }

    edit = (ev) => {
        this.props.setRightMenu("Edit");
    }

    close = (ev) => {
        this.props.setFocusEvent();
        this.props.setRightMenu("Close");
    }

    delete = (ev) => {
        const { focused_event } = this.props;
        this.props.setFocusEvent();
        deleteEvent((res)=>{console.log(res)}, focused_event.detail.id);
        
        this.props.setRightMenu("Close");
    }

  render() {
    const { focused_event } = this.props;
    return (
        <div className="App-rightmenu">
            <div className="Nav-Btns">
                <button onClick={this.edit}>edit</button>
                <button onClick={this.delete}>delete</button>
                <button onClick={this.close}>close</button>
            </div>
            
            <h1>{focused_event.detail.event_name}</h1>
            <div>{focused_event.detail.text_content}</div>
            {/* {focused_event.timetable_slots[].map(slot => {<TimeslotDetail slot={slot}></TimeslotDetail>})} */}

        {/* {curr_event.id} */}
        </div>
    )
  } 
}

const mapStateToProps = state => {
    
};

export default connect(null, {setFocusEvent, setRightMenu})(InfoMode);
