import classnames from 'classnames';
import React from 'react';

import IconEdit from './icons/IconEdit';
import IconDownload from './icons/IconDownload';
import StageActions from '../events/StageActions';

class StageLinks extends React.Component {
  handleEditSetupClick() {
    // TODO
  }

  handleDownloadClick() {
    StageActions.fetchLogs(this.props.stage);
  }

  getEditSetupLink() {
    return (
      <a key="editSetup" onClick={this.handleEditSetupClick}>
        <IconEdit />Edit Setup
      </a>
    );
  }

  getDownloadLink(disabled) {
    let classes = classnames({
      disabled: disabled
    });

    return (
      <a className={classes} key="download" onClick={this.handleDownloadClick}>
        <IconDownload />Download Logs
      </a>
    );
  }

  render() {
    let links;
    let {completed, disabledDisplay, totalErrors, failed} = this.props;

    if (disabledDisplay) {
      links = this.getDownloadLink(true)
    }

    if (completed && totalErrors === 0) {
      links = [
        this.getEditSetupLink(),
        this.getDownloadLink()
      ];
    }

    if (failed) {
      links = this.getEditSetupLink();
    }

    return (
      <div>
        {links}
      </div>
    );
  }
}

StageLinks.propTypes = {
  completed: React.PropTypes.bool,
  disabledDisplay: React.PropTypes.bool,
  failed: React.PropTypes.bool,
  stage: React.PropTypes.string,
  totalErrors: React.PropTypes.number
};

module.exports = StageLinks;
