import React, { Component } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import {setPage1, setMyGroupEvents, setRightMenu, setFocusEvent, logOut, setShowMessage} from '../../redux/actions';
import {retrieveMyGroupEvents, retrieveAllForEvent} from '../../RESTFul/ajax'
import {connect} from 'react-redux';
import '../../style/GroupEvents.css'
import {ErrorMessage} from '../../redux/reducers/message'
import Badge from 'react-bootstrap/Badge'
import { getPage1 } from '../../redux/selecter';

export class MyGroups extends Component {

  prev =(e) => {
    const {setMyGroupEvents, setShowMessage} = this.props;
    if (this.props.curr_page == 0) {
      //do nothing
    } else {
      let page_num = this.props.curr_page - 1;

      this.props.setPage1(page_num);

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
      let page_num = this.props.curr_page + 1;
      this.props.setPage1(page_num);


      retrieveMyGroupEvents(function(res) {
        setMyGroupEvents(res.data);
      }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, page_num);
    }
  }

  openInfoOfMyGroup = (e, event_id) => {
    const {setFocusEvent, setRightMenu, setShowMessage} = this.props;
        retrieveAllForEvent(function(res) {
            console.warn(res);
            setFocusEvent(res);
            setRightMenu("Info");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, event_id);
  }
  
  render() {
    const {my_groups, searchQuery,curr_page} = this.props;
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
          {my_groups.filter(group => {return (searchQuery == "" || group.name.toLowerCase().includes(searchQuery.toLowerCase()))}).map(group => 
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

const mapStateToProps = state => {
  const curr_page = getPage1(state);
  return { curr_page };
};

export default connect(mapStateToProps, {setMyGroupEvents, logOut, setFocusEvent, setRightMenu, setShowMessage, setPage1})(MyGroups);