import React, { Component } from 'react'
import EditMode from './EditMode';
import InfoMode from './InfoMode';
import {setFocusEvent, setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFocusEvent, getRightMenu } from '../../redux/selecter';
import '../../style/RightMenu.css';
import {deleteEvent} from '../../RESTFul/ajax'
import InviteePage from './InviteePage';

export class RightMenu extends Component {

  render() {
    const { rightMenu, focused_event } = this.props;
    let rightmenu_page;
    switch (rightMenu) {
      case "Edit":
        rightmenu_page = (<EditMode focused_event={focused_event}/>);
        break;
      case "Info":
        rightmenu_page = (<InfoMode focused_event={focused_event}/>);
        break;
      case "Close":
        rightmenu_page = null;
        break;
      case "Invitee":
        rightmenu_page = (<InviteePage focused_event={focused_event}/>)
      default:
        rightmenu_page = (<div>error</div>)
    }
    return (
      <>
        {rightmenu_page}
      </>
    )
  }
}

const mapStateToProps = state => {
  console.log("RightMenu");
  console.log(state);
  const focused_event = getFocusEvent(state);
  const rightMenu = getRightMenu(state);
  console.log(rightMenu);
  console.log(focused_event);

  return {rightMenu, focused_event};
};

export default connect(mapStateToProps, {setFocusEvent, setRightMenu})(RightMenu);
