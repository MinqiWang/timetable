import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import userImage from '../../fake-data/user-image.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export class UserImage extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.props.onClick(e);
  }

  render() {
    return (
      <>
        <OverlayTrigger
            key='left'
            placement='left'
            overlay={
                <Tooltip id={`usertooltip-left`}>
                    Ken Wang
                    {/* should be the signin Name 
                    from state, and use username in cookie to set the state */}
                </Tooltip>
            }
        >
            <Image src={userImage} onClick={this.handleClick} roundedCircle width="70px" height="70px"/>
        </OverlayTrigger>
      </>
    );
  }

  componentDidMount() {
  }
}

export default UserImage
