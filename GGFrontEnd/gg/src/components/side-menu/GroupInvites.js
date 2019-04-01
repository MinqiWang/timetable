import React, { Component } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { setOthersGroupEvents, setFocusEvent, logOut, setShowMessage } from '../../redux/actions';
import {retrieveOthersGroupEvents} from '../../RESTFul/ajax'
import {connect} from 'react-redux';
import '../../style/GroupEvents.css'
import GroupInvite from './GroupInvite';
import {ErrorMessage} from '../../redux/reducers/message'

export class GroupInvites extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      curr_page: 0,
    }
  }

  prev =(e) => {
    const {setOthersGroupEvents, setShowMessage} = this.props;
    if (this.state.curr_page == 0) {
      //do nothing
    } else {
      let page_num = this.state.curr_page - 1;

      this.setState(prevState => 
        ({ curr_page: prevState.curr_page - 1}));
      retrieveOthersGroupEvents(function(res) {
        setOthersGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }

  next = (e) => {
    const {setOthersGroupEvents, setShowMessage} = this.props;
    if (this.props.invite_groups.length < 10) {
      //do nothing
    } else {
      let page_num = this.state.curr_page + 1;
      this.setState(prevState => 
        ({ curr_page: prevState.curr_page + 1}));

      retrieveOthersGroupEvents(function(res) {
        setOthersGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }
  
  render() {
    const {invite_groups, searchQuery} = this.props;
    const {curr_page} = this.state;

    return (
      <>
        <div className="Pagination">
          <Pagination>
            <Pagination.Prev onClick={this.prev}/>
            <Pagination.Item active>{curr_page}</Pagination.Item>
            <Pagination.Next onClick={this.next}/>
          </Pagination>
        </div>
        <div className="GroupList">
            {/*Search_Result sort by alphabetical order*/}
            {invite_groups.filter(group => {return (searchQuery == "" || group.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(group => 
            <GroupInvite key={group.event_id} group={group}></GroupInvite>
            )}
        </div>
      </>
    )
  }
}

export default connect(null, {setOthersGroupEvents, setShowMessage})(GroupInvites);

