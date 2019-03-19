import React, { Component } from 'react'
import EditMode from './EditMode';
import InfoMode from './InfoMode';

export class RightMenu extends Component {

  render() {
    const { rightMenu } = this.props;
    let rightmenu_page;
    switch (rightMenu) {
      case "Edit":
        rightmenu_page = (<EditMode/>);
        break;
      case "Info":
        rightmenu_page = (<InfoMode/>);
        break;
      case "Close":
        rightmenu_page = null;
        break;
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

export default RightMenu
