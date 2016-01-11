import {Modal} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import IconDownload from './icons/IconDownload';

const METHODS_TO_BIND = [
  'handleDownloadLogs'
];

class APIErrorModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleDownloadLogs() {
    // Handle the download of logs here.
  }

  getFooter() {
    return (
      <div className="text-align-center">
        <button
          className="button button-stroke button-rounded button-large"
          onClick={this.handleDownloadLogs} >
          <ul className="list-inline">
            <li>
              <IconDownload />
            </li>
            <li>
              Download Logs
            </li>
          </ul>
        </button>
      </div>
    );
  }

  getContent() {
    let errors = this.props.errors.map(function (error, i) {
      return (
        <div key={i} className="error-message-container">
          <p>
            {error.message}
          </p>
          <p className="emphasize flush-bottom">
            {error.ip}
          </p>
        </div>
      );
    });

    return (
      <div className="modal-body container-pod flush-bottom modal-content">
        {errors}
      </div>
    );
  }

  render() {
    return (
      <Modal
        footer={this.getFooter()}
        headerContainerClass="container container-pod container-pod-short"
        innerBodyClass=""
        maxHeightPercentage={0.6}
        modalClass="modal modal-large"
        onClose={this.props.onClose}
        open={this.props.open}
        showCloseButton={true}
        showHeader={false}
        showFooter={true}>
        {this.getContent()}
      </Modal>
    );
  }
}

APIErrorModal.propTypes = {
  errors: React.PropTypes.array,
  open: React.PropTypes.bool
};

module.exports = APIErrorModal;