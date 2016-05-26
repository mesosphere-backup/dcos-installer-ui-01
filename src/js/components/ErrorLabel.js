import React from 'react';

import APIErrorModal from './APIErrorModal';
import StringUtil from '../utils/StringUtil';

const METHODS_TO_BIND = ['handleErrorClose', 'handleErrorClick'];

class ErrorLabel extends React.Component {
  constructor() {
    super();

    this.state = {
      openErrorModal: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleErrorClick() {
    this.setState({openErrorModal: true});
  }

  handleErrorClose() {
    this.setState({openErrorModal: false});
  }

  getErrorLabel(errors) {
    if (!errors || errors.length === 0) {
      return <span>No Errors Found</span>;
    }

    let errorText = StringUtil.pluralize('Error', errors.length);

    return (
      <a className={this.props.className} onClick={this.handleErrorClick}>
        {`${errors.length} ${errorText}`}
      </a>
    );
  }

  render() {
    return (
      <div>
        {this.getErrorLabel(this.props.errors)}
        <APIErrorModal
          errors={this.props.errors}
          onClose={this.handleErrorClose}
          open={this.state.openErrorModal}
          step={this.props.step} />
      </div>
    );
  }
}

ErrorLabel.defaultProps = {
  className: 'error-label'
};

ErrorLabel.propTypes = {
  className: React.PropTypes.string,
  errors: React.PropTypes.array,
  step: React.PropTypes.string // preflight, deploy, postflight
};

module.exports = ErrorLabel;
