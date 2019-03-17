import React, { Component } from 'react'
import {loginIn} from '../../configs/ajax'
import '../../style/SignInUp.css'

/* This is the component responsible for the third party sign-in sign-up */
export class SignInUp extends Component {

  doSuccess = (res) => {
    console.log(res);
  }

  fblogin = () => {loginIn(this.doSuccess)}

  render() {
    return (
      <div className="SignInUp">
        <div className="buttons">
          <div className="fb-button login-button" onClick={this.fblogin}>
          </div>
        </div>
      </div>
    )
  }
}

export default SignInUp
