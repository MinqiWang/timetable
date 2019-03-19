import React, { Component } from 'react'

export class RightMenu extends Component {

  render() {
    const { rightMenu } = this.props;
    let rightmenu_page;
    switch (rightMenu) {
      case "Edit":
        rightmenu_page = (<div className="App-sidemenu">edit</div>);
        break;
      case "Info":
        rightmenu_page = (<div className="App-sidemenu">info</div>);
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
