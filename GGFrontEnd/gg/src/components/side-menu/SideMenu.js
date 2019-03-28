import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import InputGroup from'react-bootstrap/InputGroup';
import FormControl from'react-bootstrap/FormControl';
import '../../style/SideMenu.css';
import Image from 'react-bootstrap/Image';
import {setFriends, logOut} from '../../redux/actions'
import {connect} from 'react-redux';
import { getFriends } from '../../redux/selecter';
import { retrieveFriendlist } from '../../RESTFul/ajax';


export class SideMenu extends Component {
  constructor(props) {
    super(props)

    const {setFriends, logOut} = this.props;
    retrieveFriendlist(function(res) {
      setFriends(res.data);
    }, logOut);
    this.state = {
      show: true,
      searchQuery: "",
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
    let searchQuery = document.getElementById("friendSearchBar").value;
    this.setState({searchQuery})
    // search!!
    // setSearchResult
  }

  cancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({searchQuery: ""})
    document.getElementById("friendSearchBar").value = "";
    // reset Search Result to null
  }

  render() {
    const {show, searchQuery} = this.state;
    let {Friends} = this.props;
    let showOrEclipse = show? "eclipse" : "show";
    // let friendList = this.sort(Friends);
    let friendList = Friends;

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
                defaultValue={searchQuery}
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Go</Button>
                    <Button variant="secondary" onClick={this.cancel}>Back</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
        <div className="FriendList">
            {/*Search_Result sort by alphabetical order*/}
            {friendList.filter(friend => {return (searchQuery == "" || friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(friend => 
            <div className="resultUser">
              <Image src={friend.avatarURL} roundedCircle width="70px" height="70px"/>
              <div>{friend.name}</div>
              <Button onClick={this.timetable}>Timetable</Button>
            </div>
            )}
        </div>
      </div> : null
      }
      <div onClick={this.showFriendList}>{showOrEclipse}</div>
      </>
    )
  }
}



const mapStateToProps = state => {
  console.log("SearchFriend");
  console.log(state);
  const Friends = getFriends(state);

  return {Friends};
};
export default connect(mapStateToProps, {logOut, setFriends})(SideMenu);