import React, { Component } from 'react'
import '../../style/SignInUp.css'

/* This is the component responsible for the third party sign-in sign-up */
export class SignInUp extends Component {

  fblogin = () => {window.open("https://gogoapp.website:443/auth/facebook");
  window.close();}

  render() {
    return (
      <div className="SignInUp">
        <div className="buttons">
          <a className="fb-button login-button" onClick={this.fblogin}>
          </a>
        </div>
      </div>
    )
  }
}

export default SignInUp
