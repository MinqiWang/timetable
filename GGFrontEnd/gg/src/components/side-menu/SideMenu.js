import React, { Component } from 'react'
import Button from'react-bootstrap/Button';
import InputGroup from'react-bootstrap/InputGroup';
import FormControl from'react-bootstrap/FormControl';
import '../../style/SideMenu.css'


export class SideMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true
    }
  }

  showFriendList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      show: !prevState.show
    }))
  }

  search = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(document.getElementById("friendSearchBar").value);
    // search!!
    // setSearchResult
  }

  cancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // reset Search Result to null
  }

  render() {
    const {show} = this.state;
    let showOrEclipse = show? "eclipse" : "show";

    return (
      <>
      {this.state.show? 
      <div className="SearchExistFriend">
        <div className="SearchBar">
            <InputGroup size="sm" className="mb-3">
                <FormControl
                id="friendSearchBar"
                placeholder="Friend's Name"
                aria-label="Friend's Name"
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Go</Button>
                    <Button variant="secondary" onClick={this.cancel}>Back</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
        <div className="FriendList">
          {/*Search_Result sort by alphabetical order*/}
        </div>
      </div> : null
      }
      

      <div onClick={this.showFriendList}>{showOrEclipse}</div>
       
      </>
    )
  }
}

export default SideMenu
