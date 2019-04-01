import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import '../../style/SearchFriend.css'
import { logOut, setSearchFriend, setPendingRequests, setShowMessage } from '../../redux/actions';
import {retrieveSearchFriendById, invite, retrievePendingFriendlist, accept, reject} from '../../RESTFul/ajax';
import { getSearchFriend, getPendingRequests } from '../../redux/selecter';
import {connect} from 'react-redux';
import AvatarAndName from '../AvatarAndName'
import {ErrorMessage} from '../../redux/reducers/message'


export class SearchFriend extends Component {
    constructor(props) {
      super(props)
      const {setPendingRequests, setShowMessage} = this.props;
      retrievePendingFriendlist(function(res) {
        setPendingRequests(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);});
      
      this.state = {
         firstTime: true
      }
    }
    

    search = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({firstTime: false})
        const {setSearchFriend, setShowMessage} = this.props;
        let friend_id = document.getElementById("searchBar").value;
        retrieveSearchFriendById(function(res) {
            
            if (res.data != 'This is you!') setSearchFriend(res.data);
            else setSearchFriend();
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, friend_id);
    }

    add = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        const {logOut, setSearchFriend, setShowMessage} = this.props;
        invite(function(res1) {
            retrieveSearchFriendById(function(res) {
                if (res.data != 'This is you!') setSearchFriend(res.data);
                else setSearchFriend();
            }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, user_id);
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, user_id);
    }

    acceptInvitation = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        let {setPendingRequests, logOut, setShowMessage} = this.props;
        accept(function(res) {
            retrievePendingFriendlist(function(res) {
                setPendingRequests(res.data);
            }, function(res) {console.warn(res); setShowMessage(ErrorMessage);});
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, user_id);
    }

    rejectInvitation = (e, user_id) => {
        e.preventDefault();
        e.stopPropagation();
        let {setPendingRequests, logOut, setShowMessage} = this.props;
        reject(function(res) {
            retrievePendingFriendlist(function(res) {
                setPendingRequests(res.data);
            }, function(res) {console.warn(res); setShowMessage(ErrorMessage);});
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, user_id);
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
    const searchFriend = getSearchFriend(state);
    const pendingRequests = getPendingRequests(state);

    return {searchFriend, pendingRequests};
};
export default connect(mapStateToProps, {logOut, setSearchFriend, setPendingRequests, setShowMessage})(SearchFriend);
