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
        deleteEvent((res)=>{console.log(res)}, focused_event.event_id);
        
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
            
            <div>curr_event name</div>
            <div>curr_event text</div>
            <div>curr_event media</div>
            <div>curr_event media</div>


        {/* {curr_event.id} */}
        </div>
    )
  } 
}

const mapStateToProps = state => {
    console.log("Info");
    console.log(state);
    const focused_event = getFocusEvent(state);
    return {focused_event};
};

export default connect(mapStateToProps, {setFocusEvent, setRightMenu})(InfoMode);
