import classnames from 'classnames';
import React from 'react';

import IconDownload from './icons/IconDownload';
import IconEdit from './icons/IconEdit';
import ProcessStageUtil from '../utils/ProcessStageUtil';
import StageActions from '../events/StageActions';

const METHODS_TO_BIND = ['handleDownloadClick', 'handleEditSetupClick'];

class StageLinks extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleEditSetupClick() {
    this.context.router.push('/setup');
  }

  handleDownloadClick() {
    StageActions.fetchLogs(this.props.stage);
  }

  getEditSetupLink() {
    if (this.props.disableEditSetup) {
      return null;
    }

    return (
      <a className="stage-link"
        key="editSetup"
        onClick={this.handleEditSetupClick}>
        <IconEdit />Edit Setup
      </a>
    );
  }

  getDownloadLink(disabled) {
    let classes = classnames('stage-link', {
      disabled: disabled
    });

    return (
      <a className={classes}
        href={ProcessStageUtil.getLogsURL()}
        key="download"
        target="_blank"
        onClick={this.handleDownloadClick}>
        <IconDownload />Download Logs
      </a>
    );
  }

  render() {
    let links;
    let {completed, disabledDisplay, failed, totalErrors} = this.props;

    if (disabledDisplay) {
      links = this.getDownloadLink(true)
    }

    if (completed && totalErrors > 0) {
      links = [
        this.getEditSetupLink(),
        this.getDownloadLink()
      ];
    }

    if (completed && totalErrors === 0) {
      links = this.getDownloadLink();
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

StageLinks.contextTypes = {
  router: React.PropTypes.object
};

StageLinks.defaultProps = {
  disableEditSetup: false
}

StageLinks.propTypes = {
  completed: React.PropTypes.bool,
  disabledDisplay: React.PropTypes.bool,
  disableEditSetup: React.PropTypes.bool,
  failed: React.PropTypes.bool,
  stage: React.PropTypes.string,
  totalErrors: React.PropTypes.number
};

module.exports = StageLinks;
