import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import userImage from '../fake-data/user-image.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button';

export class UserImage extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isLogIn: false
    }
  }

  componentDidMount() {
    this.setState({isLogIn: false})
  }
  
  signIn() {
    console.log('sign in page opend!')
  }

  render() {
    return (
      this.state.isLogIn ?
      <>
        <OverlayTrigger
            key='bottom'
            placement='bottom'
            overlay={
                <Tooltip id={`usertooltip-bottom`}>
                    Ken Wang
                </Tooltip>
            }
        >
            <Image src={userImage} roundedCircle width="70px" height="70px"/>
        </OverlayTrigger>
      </> :
      <>
        <Button onClick={() => this.signIn()} >SignIn/SignUp</Button>
      </>
    )
  }
}

export default UserImage
