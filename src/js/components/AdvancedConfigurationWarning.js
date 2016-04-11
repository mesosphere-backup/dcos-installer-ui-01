import {Modal} from 'reactjs-components';
import React from 'react';

import Config from '../config/Config';

class AdvancedConfigurationWarning extends React.Component {
  getContent() {
    return (
      <div className="text-align-center">
        <h1 className="advanced-configuration-warning-header short">
          Advanced Configuration Detected
        </h1>
        <p className="flush-bottom">
          It appears as though you have a previously setup Advanced
          Configuration for the listed IP address(es). Please use the command
          line interface to continue your installation of the {Config.productName}.
        </p>
      </div>
    );
  }

  getFooter() {
    return (
      <div className="text-align-center">
        <a className="button button-primary button-rounded"
          href={`${Config.documentationURI}/administration/installing/`}>
          View Documentation
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="advanced-configuration-wrapper flex-box
        flex-box-align-vertical-center flex-box-align-horizontal-center">
        <Modal
          backdropClass="modal-backdrop advanced-configuration-warning-backdrop"
          closeByBackdropClick={false}
          containerClass="modal-container advanced-configuration-warning"
          footer={this.getFooter()}
          maxHeightPercentage={0.9}
          modalClass="modal"
          open={true}
          showCloseButton={false}
          showHeader={false}
          showFooter={true}
          subHeader={"Sub-header"}
          titleClass="modal-header-title text-align-center flush-top"
          titleText={"Title Text"}>
          {this.getContent()}
        </Modal>
      </div>
    );
  }
}

module.exports = AdvancedConfigurationWarning;
