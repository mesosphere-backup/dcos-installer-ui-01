import classnames from 'classnames';
import React from 'react';

import IconCheckmark from '../components/icons/IconCheckmark';
import IconWarningSmall from '../components/icons/IconWarningSmall';
import Timer from '../components/Timer';

class ProgressBar extends React.Component {
  render() {
    let props = this.props;
    let timer = null;

    let {
      className,
      errorFillClassName,
      fillWrapperClassName,
      headerClassName,
      label,
      labelClassName,
      labelContentClassName,
      layoutClassName,
      percentComplete,
      progress,
      successFillClassName,
      timerClassName,
      timerEnabled
    } = props;

    let {percentError, percentSuccess} = progress;
    let classes = classnames(className, layoutClassName);

    if (timerEnabled) {
      timer = <Timer className={timerClassName} ref="timer" />;
    }

    return (
      <div className={classes}>
        <div className={headerClassName}>
          <span className={labelClassName}>
            <span className={labelContentClassName}>{label}</span>
          </span>
          {timer}
        </div>
        <div className={fillWrapperClassName}>
          <div className={errorFillClassName} style={{
            width: `${percentError}%`
          }} />
          <div className={successFillClassName} style={{
            width: `${percentSuccess}%`
          }} />
        </div>
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  className: 'progress-bar',
  detailClassName: 'progress-bar-detail',
  errorFillClassName: 'progress-bar-fill progress-bar-fill-error',
  headerClassName: 'progress-bar-header',
  fillWrapperClassName: 'progress-bar-fill-wrapper',
  labelClassName: 'progress-bar-label',
  labelContentClassName: 'progress-bar-label-content',
  layoutClassName: '',
  progress: 0,
  successFillClassName: 'progress-bar-fill progress-bar-fill-success',
  timerClassName: 'progress-bar-timer',
  timerEnabled: true
};

ProgressBar.propTypes = {
  className: React.PropTypes.string,
  detail: React.PropTypes.node,
  detailClassName: React.PropTypes.string,
  headerClassName: React.PropTypes.string,
  successFillClassName: React.PropTypes.string,
  fillWrapperClassName: React.PropTypes.string,
  label: React.PropTypes.node.isRequired,
  labelClassName: React.PropTypes.string,
  labelContentClassName: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
  progress: React.PropTypes.object.isRequired,
  timerClassName: React.PropTypes.string,
  timerEnabled: React.PropTypes.bool
};

module.exports = ProgressBar;
