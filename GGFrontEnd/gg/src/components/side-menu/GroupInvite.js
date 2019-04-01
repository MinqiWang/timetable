import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Image from 'react-bootstrap/Image'
import '../../style/GroupEvents.css'
import '../../style/Timetable.css'
import {ErrorMessage} from '../../redux/reducers/message'


import {rejectGroupEvent, acceptGroupEvent, retrieveAllForEvent} from '../../RESTFul/ajax'
import {readOnly, setOthersGroupEvents, setFocusEvent, logOut, setRightMenu, isNotDefault, setShowMessage } from '../../redux/actions';
import {connect} from 'react-redux';

export class GroupInvite extends Component {

    openInfoOfInviteGroup = (e) => {
        const {logOut, group, setFocusEvent, setRightMenu, isNotDefault, setShowMessage} = this.props;
        retrieveAllForEvent(function(res) {
            console.warn(res);
            setFocusEvent(res);
            readOnly();
            setRightMenu("Info");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, group.event_id);
    }

    accept = (e) => {
        const {logOut, group, setShowMessage} = this.props;
        acceptGroupEvent(function(res) {
            console.log("accept");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, group.event_id);
    }

    reject = (e) => {
        const {logOut, group, setShowMessage} = this.props;
        rejectGroupEvent(function(res) {
            console.log("reject");
        }, function(res) {console.warn(res); setShowMessage(ErrorMessage);}, group.event_id);
    }

    render() {
        const {group} = this.props;
        let variant;
        let status;
        let borderColor;
        let AR_buttons;
        switch (group.has_accepted) {
            case null:
                variant = "warning";
                status = "NOT DECIDED";
                borderColor = "#ffc107";
                AR_buttons = 
                    <ButtonGroup toggle size="sm">
                        <Button onClick={this.accept}>Accept</Button>
                        <Button onClick={this.reject}>Reject</Button>
                    </ButtonGroup>;
                break;
            case 1:
                variant = "success";
                status = "YOU ACCPECTED";
                borderColor = "#28a745";
                break;
            case 0:
                variant = "danger"
                status = "YOU REJECTED"
                borderColor = "#dc3545"
                break;
            default:
                variant = "warning"
                status = "NOT DECIDED"
                borderColor = "#ffc107"
        }
        let BorderStyle = {};
        BorderStyle.borderColor = borderColor;
        return (
            <>
            <div className="resultGroup" onDoubleClick={this.openInfoOfInviteGroup} style={BorderStyle}>
                <Badge variant={variant}>
                    {status}
                </Badge>
                <div className="wordBreak">Event Name: {group.event_name}</div>
                <div>Inviter:</div>
                <div>
                    <Image src={group.avatarURL} roundedCircle />
                    <div>{group.name}</div>
                </div>
                {AR_buttons}
                
            </div>
        </>
        )
    }
}

export default connect(null, {logOut, setFocusEvent, isNotDefault, setRightMenu, setShowMessage})(GroupInvite);
