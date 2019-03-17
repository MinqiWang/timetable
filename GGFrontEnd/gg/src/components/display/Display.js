import React, { Component } from 'react'
import Advertisement from './Advertisement';
import Timetable from './Timetable';
import SignInUp from './SignInUp';

/* This is the component responsible for switching Advertisement, SignInUp, Map, Timetable 
  in different condition: If signed in, the user sees Map/Timetable, if loged out, he sees
  Advertisement first, he clicked signin, then shows sign in display
*/
export class Display extends Component {
  render() {
    return (
      <>
        {/* <Advertisement/> */}
        {/* <SignInUp></SignInUp> */}
        <Timetable></Timetable>
      </>
    )
  }
}

export default Display
