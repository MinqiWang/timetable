import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';

import { getShowMessage } from './redux/selecter';
import {setShowMessage} from './redux/actions'

class Message extends Component {
    constructor(props, context) {
      super(props, context);
      this.handleClose = this.handleClose.bind(this);
    }
  
    handleClose() {
      this.props.setShowMessage();
    }
  
    render() {
        const {showMessage} = this.props;

        let footer = (
            showMessage.canUserClose?
        <Modal.Footer>
              <Button variant="primary" onClick={this.handleClose}>
                Got it
              </Button>
        </Modal.Footer> : null)
      return (
        <>
          <Modal show={showMessage.show}>
            <Modal.Header>
              <Modal.Title>{showMessage.header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{showMessage.body}</Modal.Body>
            {footer}
          </Modal>
        </>
      );
    }
  }

  const mapStateToProps = state => {
    const showMessage = getShowMessage(state);
    return {showMessage};
};
export default connect(mapStateToProps, {setShowMessage})(Message);