import React, { Component } from 'react'
import ToInvite from './ToInvite';
import Invitees from './Invitees';
import Button from 'react-bootstrap/Button';
import InputGroup from'react-bootstrap/InputGroup';
import FormControl from'react-bootstrap/FormControl';
import {setRightMenu} from '../../redux/actions';
import { connect } from 'react-redux';
import { getFriends} from '../../redux/selecter';

export class InviteePage extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       isEditing: false,
       searchQuery: "",
    }
  }
  

    back = (e) => {
        this.props.setRightMenu("Info");
    }

    addInvitee = (e) => {
      this.setState({isEditing: true});
    }

    cancelInvite = (e) => {
      this.setState({isEditing: false});
      this.setState({searchQuery: ""})
      document.getElementById("invite-SearchBar").value = "";
    }

    search = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.warn(this.state.displayControl);
      let searchQuery = document.getElementById("invite-SearchBar").value;
      this.setState({searchQuery})
    }
  
    cancel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({searchQuery: ""})
      document.getElementById("invite-SearchBar").value = "";
    }

    
  render() {
    const {isEditing, searchQuery} = this.state;
    const {Friends} = this.props;
    let group_invitee = [];
    let toInviteFriends = Friends.filter(friend => 
      {// filter out group invitee
        return true;})
    let display = isEditing? <ToInvite searchQuery={searchQuery} friends={toInviteFriends}/> : <Invitees searchQuery={searchQuery} friends={Friends}/>;
    let placeholder= isEditing? "To Invite": "Invited"
    return (
      <div>
        <div className="Nav-Btns">
          {
            isEditing? 
            <>
            <button onClick={this.sendInvites}>send Invites</button>

            <button onClick={this.cancelInvite}>cancel</button>
            </>
            : 
            <>
            <button onClick={this.addInvitee}>add more friends</button>

            <button onClick={this.back}>back</button>
            </>
          }
            
        </div>
        <div className="SearchBar">
            <InputGroup className="mb-3">
                <FormControl
                id="invite-SearchBar"
                placeholder= {placeholder + " friend's name"}
                aria-label={placeholder + " friend's name"}
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="primary" onClick={this.search}>Go</Button>
                    <Button variant="secondary" onClick={this.cancel}>Clear</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
        {display}
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("Invitee");
  console.log(state);
  const Friends = getFriends(state);
  return {Friends};
};

export default connect(mapStateToProps, {setRightMenu})(InviteePage);
