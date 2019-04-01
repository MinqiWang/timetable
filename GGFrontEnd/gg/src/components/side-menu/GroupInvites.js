import React, { Component } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { setOthersGroupEvents, setFocusEvent, logOut, setShowMessage, setPage2 } from '../../redux/actions';
import {retrieveOthersGroupEvents} from '../../RESTFul/ajax'
import {connect} from 'react-redux';
import '../../style/GroupEvents.css'
import GroupInvite from './GroupInvite';
import {ErrorMessage} from '../../redux/reducers/message'
import { getPage2 } from '../../redux/selecter';

export class GroupInvites extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      curr_page: 0,
    }
  }

  prev =(e) => {
    const {setOthersGroupEvents, setShowMessage} = this.props;
    if (this.props.curr_page == 0) {
      //do nothing
    } else {
      let page_num = this.props.curr_page - 1;
      this.props.setPage2(page_num);

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
      let page_num = this.props.curr_page + 1;
      this.props.setPage2(page_num);

      retrieveOthersGroupEvents(function(res) {
        setOthersGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }
  
  render() {
    const {invite_groups, searchQuery, curr_page} = this.props;

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

const mapStateToProps = state => {
  const curr_page = getPage2(state);
  return { curr_page };
};


export default connect(mapStateToProps, {setOthersGroupEvents, setShowMessage, setPage2})(GroupInvites);

