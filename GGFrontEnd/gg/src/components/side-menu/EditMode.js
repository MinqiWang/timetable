import React, { Component } from 'react';
import {setCurrEvent, setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getCurrentEvent } from '../../redux/selecter';
import '../../style/RightMenu.css';

export class EditMode extends Component {

    save = (ev) => {
        console.log("save");
    }
    cancel = (ev) => {
        this.props.setRightMenu("Info");
    }

  render() {
    return (
        <div className="App-rightmenu">
            <div className="Nav-Btns">
                <button onClick={this.save}>save</button>
                <button onClick={this.cancel}>cancel</button>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
    const curr_event = getCurrentEvent(state);
    return {curr_event};
};


export default connect(mapStateToProps, {setCurrEvent, setRightMenu})(EditMode);