import {Confirm} from 'reactjs-components';
import React from 'react';

import Config from '../config/Config';

class SetupFormConfirmation extends React.Component {
  render() {
    return (
      <Confirm
        disabled={this.props.pendingRequest}
        dynamicHeight={false}
        footerContainerClass="container container-pod container-pod-short
          container-pod-fluid flush-top flush-bottom"
        modalClass="modal modal-large modal-confirmation"
        open={this.props.open}
        onClose={this.props.handleButtonCancel}
        leftButtonCallback={this.props.handleButtonConfirm}
        leftButtonClassName="button button-large button-rounded button-success"
        leftButtonText="Continue to Pre-Flight"
        rightButtonClassName="button button-link button-new-line"
        rightButtonCallback={this.props.handleButtonCancel}
        rightButtonText="Cancel"
        useGemini={false}>

        <div className="text-align-center">
          <h1 className="flush-top short modal-heading">Warning!</h1>
          <p className="modal-copy tall">
            {'The master and agent machines that you have specified will be ' +
            'checked for appropriate configuration and software. Any missing ' +
            'prerequisites will be added automatically. For more information,' +
            ' see the '}
            <a href={`${Config.documentationURI}/administration/installing/`}
              target="_blank">documentation</a>.
          </p>
        </div>
      </Confirm>
    );
  }
}

SetupFormConfirmation.propTypes = {
  handleButtonCancel: React.PropTypes.func,
  handleButtonConfirm: React.PropTypes.func,
  open: React.PropTypes.bool,
  pendingRequest: React.PropTypes.bool
};

module.exports = SetupFormConfirmation;
