import React, { Component } from 'react';
import {setCurrEvent, setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getCurrentEvent } from '../../redux/selecter';
import '../../style/RightMenu.css';

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
        this.props.setRightMenu("Close");
    }

  render() {
    const { curr_event } = this.props;
    return (
        <div className="App-rightmenu">
            <div className="Nav-Btns">
                <button onClick={this.edit}>edit</button>
                <button>delete</button>
                <button onClick={this.close}>close</button>
            </div>
        {/* {curr_event.id} */}
        </div>
    )
  } 
}

const mapStateToProps = state => {
    const curr_event = getCurrentEvent(state);
    return {curr_event};
};

export default connect(mapStateToProps, {setCurrEvent, setRightMenu})(InfoMode);
