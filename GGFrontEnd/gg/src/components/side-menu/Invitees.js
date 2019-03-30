import React, { Component } from 'react'
import AvatarAndName from '../AvatarAndName'
import '../../style/FriendList.css';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export class Invitees extends Component {
  render() {
    const {friend} = this.props;
    let variant;
    let status;
    switch (friend.has_accepted) {
      case null:
        variant = "warning"
        status = "PENDING"
        break;
      case true:
        variant = "success"
        status = "ACCPECT"
        break;

      case false:
        variant = "danger"
        status = "REJECT"
        break;
      default:
        variant = "warning"
        status = "PENDING"
    }
    
    return (
        <div className="resultUser">
          <AvatarAndName person={friend}></AvatarAndName>

          <Badge pill variant={variant}>
            {status}
          </Badge>
          <Button>Recall</Button>
        </div>
    )
  }
}

export default Invitees
