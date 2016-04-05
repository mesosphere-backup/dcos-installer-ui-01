import {Confirm} from 'reactjs-components';
import React from 'react';

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
            {'Machines will be checked for appropriate configuration. ' +
            'Machines detected without DCOS pre-requisite packages will be ' +
            'patched with the necessary packages. For more info see '}
            <a href="https://docs.mesosphere.com/getting-started/installing/"
              target="_blank">
              docs
            </a>.
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
