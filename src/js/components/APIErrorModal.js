import {Modal} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import IconDownload from './icons/IconDownload';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import {removeANSI} from '../utils/StringUtil';
import StoreMap from '../constants/StoreMap';

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
    StoreMap[this.props.step].fetchLogs(this.props.step);
  }

  getFooter() {
    return (
      <div className="text-align-center">
        <a
          className="button button-stroke button-rounded button-large"
          href={ProcessStageUtil.getLogsURL()}
          target="_blank"
          onClick={this.handleDownloadLogs} >
          <ul className="list-inline">
            <li>
              <IconDownload />
            </li>
            <li>
              Download Logs
            </li>
          </ul>
        </a>
      </div>
    );
  }

  getMessage(message) {
    return message.split('\n').map(function (line, i) {
      if (line === '') {
        return null;
      }

      return (
        <p key={i}>{removeANSI(line)}</p>
      );
    })
  }

  getContent() {
    let errors = this.props.errors.map((error, i) => {
      return (
        <div key={i} className="error-message-container">
          <p>
            {this.getMessage(error.message)}
          </p>
          <p className="emphasize flush-bottom">
            {error.host}
          </p>
        </div>
      );
    });

    return (
      <div className="modal-body container-pod modal-content">
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

APIErrorModal.defaultProps = {
  errors: []
};

APIErrorModal.propTypes = {
  errors: React.PropTypes.array,
  open: React.PropTypes.bool
};

module.exports = APIErrorModal;
