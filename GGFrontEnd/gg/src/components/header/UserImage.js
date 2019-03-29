import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import userImage from '../../fake-data/user-image.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { getUser } from '../../redux/selecter';
import {connect} from 'react-redux'


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
    const {User} = this.props;
    console.log(User);
    return (
      <>
        <OverlayTrigger
            key='left'
            placement='left'
            overlay={
                <Tooltip id={`usertooltip-left`}>
                    {User? User.name : null}
                    {/* should be the signin Name 
                    from state, and use username in cookie to set the state */}
                </Tooltip>
            }
        >
            <Image src={User? User.avatarURL : null} onClick={this.handleClick} roundedCircle width="70px" height="70px"/>
        </OverlayTrigger>
      </>
    );
  }

  componentDidMount() {
  }
}

const mapStateToProps = state => {
  console.log("UserImage");
    console.log(state);
  const User = getUser(state)
  return { User };
};

export default connect(mapStateToProps, {})(UserImage);
