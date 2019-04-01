import React, { Component } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { setMyGroupEvents, setRightMenu, setFocusEvent, logOut, setShowMessage} from '../../redux/actions';
import {retrieveMyGroupEvents, retrieveAllForEvent} from '../../RESTFul/ajax'
import {connect} from 'react-redux';
import '../../style/GroupEvents.css'
import {ErrorMessage} from '../../redux/reducers/message'
import Badge from 'react-bootstrap/Badge'

export class MyGroups extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      curr_page: 0,
    }
  }

  prev =(e) => {
    const {setMyGroupEvents, setShowMessage} = this.props;
    if (this.state.curr_page == 0) {
      //do nothing
    } else {
      let page_num = this.state.curr_page - 1;

      this.setState(prevState => 
        ({ curr_page: prevState.curr_page - 1}));
      retrieveMyGroupEvents(function(res) {
        setMyGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }

  next = (e) => {
    const {setMyGroupEvents, setShowMessage} = this.props;
    if (this.props.my_groups.length < 10) {
      //do nothing
    } else {
      let page_num = this.state.curr_page + 1;
      this.setState(prevState => 
        ({ curr_page: prevState.curr_page + 1}));

      retrieveMyGroupEvents(function(res) {
        setMyGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }

  openInfoOfMyGroup = (e, event_id) => {
    const {logOut, setFocusEvent, setRightMenu, setShowMessage} = this.props;
        retrieveAllForEvent(function(res) {
            console.warn(res);
            setFocusEvent(res);
            setRightMenu("Info");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, event_id);
  }
  
  render() {
    const {my_groups, searchQuery} = this.props;
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
          {my_groups.filter(group => {return (searchQuery == "" || group.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(group => 
          // <GroupInvite key={group.event_id} group={group}></GroupInvite>
          <div className="resultGroup" onDoubleClick={(e) => this.openInfoOfMyGroup(e, group.event_id)}>
                <Badge variant="success" className="wordBreak">
                  {"Event Name: " + group.event_name}
                </Badge>
            </div>
          )}
      </div>
    </>
    )
  }
}

export default connect(null, {setMyGroupEvents, logOut, setFocusEvent, setRightMenu, setShowMessage})(MyGroups);