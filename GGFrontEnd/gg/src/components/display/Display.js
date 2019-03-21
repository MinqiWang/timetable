import React, { Component } from 'react'
import Advertisement from './Advertisement';
import Timetable from './Timetable';
import SignInUp from './SignInUp';
import Map from './Map';


/* This is the component responsible for switching Advertisement, SignInUp, Map, Timetable 
  in different condition: If signed in, the user sees Map/Timetable, if loged out, he sees
  Advertisement first, he clicked signin, then shows sign in display
*/
export class Display extends Component {
  render() {
    const { display } = this.props;
    let display_page;
    switch (display) {
      case "Timetable":
        display_page = (<Timetable></Timetable>);
        break;
      case "SignInUp":
        display_page = (<SignInUp/>);
        break;
      case "Map":
        display_page = (<Map/>);
        break;
      default:
        display_page = (<div>error</div>)
    }
    return (
      <>
        {display_page}
      </>
    )
  }
}

export default Display
