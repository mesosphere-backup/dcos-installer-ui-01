import {Modal} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import IconDownload from './icons/IconDownload';

const METHODS_TO_BIND = [
  'handleModalClose',
  'handleServerError',
  'handleDownloadLogs'
];

function getEventsFromStoreListeners(storeListeners) {
  let events = [];

  storeListeners.forEach((store) => {
    store.events.forEach((storeEvent) => {
      events.push(this.store_getChangeFunctionName(store.name, storeEvent));
    });
  });

  return events;
}

class APIErrorModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      isOpen: false,
      errors: []
    };

    this.store_listeners = [
      // Add stores here.
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    let events = getEventsFromStoreListeners.call(this, this.store_listeners);
    events.forEach((event) => {
      this[event] = this.handleServerError;
    });
  }

  handleModalClose() {
    this.setState({
      isOpen: false,
      errors: []
    });
  }

  handleServerError(id, errorMessage) {
    let errors = this.state.errors.concat([errorMessage]);

    this.setState({
      errors,
      isOpen: true
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
    let errors = this.state.errors.map(function (error) {
      return (
        <div className="error-message-container">
          <p key="errorMessage">
            {error.message}
          </p>
          <p className="emphasize flush-bottom" key="errorIP">
            {error.ip}
          </p>
        </div>
      );
    });

    return (
      <div>
        {errors}
      </div>
    );
  }

  render() {
    return (
      <Modal
        bodyClass="modal-body container-pod flush-bottom modal-content"
        footer={this.getFooter()}
        headerContainerClass="container container-pod container-pod-short"
        innerBodyClass="modal-content-inner"
        maxHeightPercentage={0.6}
        modalClass="modal modal-large"
        onClose={this.handleModalClose}
        open={this.state.isOpen}
        showCloseButton={false}
        showHeader={false}
        showFooter={true}>
        {this.getContent()}
      </Modal>
    );
  }
}

module.exports = APIErrorModal;
