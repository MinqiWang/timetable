import React, { Component } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

export class Footer extends Component {
  render() {
    return (
      <>
        <ButtonGroup toggle size="lg">
          <ToggleButton type="radio" name="radio" defaultChecked value="1">
            TimeTable
          </ToggleButton>
          <ToggleButton type="radio" name="radio" value="2">
            Map
          </ToggleButton>
        </ButtonGroup>
      </>
    )
  }
}

export default Footer
