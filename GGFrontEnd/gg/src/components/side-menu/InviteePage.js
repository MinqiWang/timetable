import React, { Component } from 'react'

export class InviteePage extends Component {

    back = (e) => {
        this.props.setRightMenu("Info");
    }

    
  render() {
    return (
      <div>
        <div className="Nav-Btns">
            <button onClick={this.back}>back</button>
        </div>
        {/* <div className="SearchBar">
            <InputGroup className="mb-3">
                <FormControl
                id="searchBar"
                placeholder="Friend's Name"
                aria-label="Friend's Name"
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </div> */}
      </div>
    )
  }
}

export default InviteePage
