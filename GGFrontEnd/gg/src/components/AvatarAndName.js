import Image from 'react-bootstrap/Image';
import React, { Component } from 'react'

export class AvatarAndName extends Component {
  render() {

    const {person} = this.props;
    return (
        <>
        <Image src={person.avatarURL} roundedCircle/>
        <div>{person.name}</div>
        </>
    )
  }
}

export default AvatarAndName