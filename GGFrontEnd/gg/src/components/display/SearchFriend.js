import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import '../../style/SearchFriend.css'
import { logOut, setSearchFriend, setPendingRequests } from '../../redux/actions';
import {retrieveSearchFriendById, invite, retrievePendingFriendlist, accept, reject} from '../../RESTFul/ajax';
import { getSearchFriend, getPendingRequests } from '../../redux/selecter';
import {connect} from 'react-redux';
import AvatarAndName from '../AvatarAndName'


export class SearchFriend extends Component {
    constructor(props) {
      super(props)
      const {setPendingRequests} = this.props;
      retrievePendingFriendlist(function(res) {
        setPendingRequests(res.data);
      }, this.props.logOut);
      
      this.state = {
         firstTime: true
      }
    }
    

    search = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({firstTime: false})
        const {setSearchFriend} = this.props;
        let friend_id = document.getElementById("searchBar").value;
        retrieveSearchFriendById(function(res) {
            
            if (res.data != 'This is you!') setSearchFriend(res.data);
            else setSearchFriend();
        }, this.props.logOut, friend_id);
    }

    add = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        const {logOut, setSearchFriend} = this.props;
        invite(function(res1) {
            retrieveSearchFriendById(function(res) {
                if (res.data != 'This is you!') setSearchFriend(res.data);
                else setSearchFriend();
            }, logOut, user_id);
        }, logOut, user_id);
    }

    acceptInvitation = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        let {setPendingRequests, logOut} = this.props;
        accept(function(res) {
            retrievePendingFriendlist(function(res) {
                setPendingRequests(res.data);
            }, logOut);
        }, logOut, user_id);
    }

    rejectInvitation = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        let {setPendingRequests, logOut} = this.props;
        reject(function(res) {
            retrievePendingFriendlist(function(res) {
                setPendingRequests(res.data);
            }, logOut);
        }, logOut, user_id);
    }

  render() {
    const {searchFriend, pendingRequests} = this.props;
    const {firstTime} = this.state;
    let result;
    if (searchFriend) {
        let canAdd = (searchFriend.id_from)? false : true;
        let isFriend = (searchFriend.has_accepted)? true : false;
        result = (<div className="resultUser">
        <Image src={searchFriend.avatarURL} roundedCircle width="70px" height="70px"/>
        <div>{searchFriend.name}</div>
        {canAdd? <Button onClick={(e) => this.add(e, searchFriend.id)}>Add</Button>
        : (isFriend? <Button disabled>You are friends!</Button> : <Button disabled>Wait Response</Button>)}
        </div>)
    } else {
        result = (firstTime? null: <div>no result/is yourself</div>)
    }

    console.log(pendingRequests);
    return (
    <div className="SearchFriend">
        <div className="SearchBar">
            <InputGroup className="mb-3">
                <FormControl
                id="searchBar"
                placeholder="Friend's GoGo ID"
                aria-label="Friend's GoGo ID"
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>

        <div>Search Results:</div>
        <div className="SearchResult">
            {result}
        </div>

        <div className="PendingRequests">
            <div>Pending Requests:</div>
            <div className="SearchResult">
                {(pendingRequests)? Object.values(pendingRequests).map(
                    pending => 
                    <div className="resultUser" key={pending.id}>
                        <AvatarAndName person={pending}></AvatarAndName>
                        <Button onClick={(e) => this.acceptInvitation(e, pending.id)}>Accept</Button>
                        <Button onClick={(e) => this.rejectInvitation(e, pending.id)}>Reject</Button>
                    </div>)
                : <div>no pending requests</div>}
            </div>
        </div>
    </div>

      
    )
  }
}

const mapStateToProps = state => {
    console.log("SearchFriend");
    console.log(state);
    const searchFriend = getSearchFriend(state);
    const pendingRequests = getPendingRequests(state);

    return {searchFriend, pendingRequests};
};
export default connect(mapStateToProps, {logOut, setSearchFriend, setPendingRequests})(SearchFriend);
