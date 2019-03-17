import React, { Component } from 'react'
import {loginIn} from '../../configs/ajax'
import '../../style/SignInUp.css'

/* This is the component responsible for the third party sign-in sign-up */
export class SignInUp extends Component {

  doSuccess = (res) => {
    console.log(res);
  }

  // Using AJAX doesn't work, have to do a full page request instead
  // https://www.freecodecamp.org/forum/t/react-with-backend-passport-twitter-cors-issue/152837
  //fblogin = () => {loginIn(this.doSuccess)}

  //<div className="fb-button login-button" onClick={this.fblogin}>

  render() {
    return (
      <div className="SignInUp">
        <div className="buttons">
          <a className="fb-button login-button" href="https://localhost:8000/auth/facebook">
          </a>
        </div>
      </div>
    )
  }
}

export default SignInUp
