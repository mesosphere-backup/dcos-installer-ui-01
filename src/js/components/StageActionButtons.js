import classnames from 'classnames';
import React from 'react';

import IconRetry from './icons/IconRetry';

class StageActionButtons extends React.Component {
  getRetryButton() {
    return (
      <button
        key="retry"
        onClick={this.props.onRetryClick}
        className="button button-large button-stroke button-rounded">
        <IconRetry />
        Retry
      </button>
    );
  }

  getNextButton(disabled) {
    let classes = classnames(
      'button button-rounded button-large', {
        disabled: disabled,
        'button-success': !disabled
      }
    );

    return (
      <button key="next" onClick={this.props.onNextClick} className={classes}>
        {this.props.nextText}
      </button>
    );
  }

  render() {
    let buttons;
    let {completed, failed, showDisabled, totalErrors} = this.props;

    if (showDisabled) {
      buttons = this.getNextButton(true);
    }

    if (completed && totalErrors === 0) {
      buttons = this.getNextButton();
    }

    if (completed && totalErrors > 0) {
      buttons = [
        this.getRetryButton(),
        this.getNextButton()
      ];
    }

    if (failed) {
      buttons = this.getRetryButton();
    }

    return (
      <div className="button-collection">
        {buttons}
      </div>
    );
  }
}

StageActionButtons.defaultProps = {
  onNextClick: function () {},
  onRetryClick: function () {}
};

StageActionButtons.propTypes = {
  completed: React.PropTypes.bool,
  failed: React.PropTypes.bool,
  nextText: React.PropTypes.string,
  onNextClick: React.PropTypes.func,
  onRetryClick: React.PropTypes.func,
  showDisabled: React.PropTypes.bool,
  totalErrors: React.PropTypes.number
};

module.exports = StageActionButtons;
