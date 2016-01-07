import classnames from 'classnames';
import React from 'react';

import IconCheckmark from '../components/icons/IconCheckmark';
import IconWarningSmall from '../components/icons/IconWarningSmall';

class ProgressBar extends React.Component {
  render() {
    let props = this.props;

    let classes = classnames(props.className, props.layoutClassName, {
      'is-erroneous': props.state === 'error',
      'is-successful': props.state === 'success'
    });

    let icon = null;
    let progress = props.progress.toFixed(props.decimalPrecision);

    if (props.state === 'error') {
      icon = <IconWarningSmall />;
    } else if (props.state === 'success') {
      icon = <IconCheckmark />;
    }

    return (
      <div className={classes}>
        <div className={props.headerClassName}>
          <span className={props.labelClassName}>
            {icon}{props.label}
          </span>
          <span className={props.progressClassName}>
            {`${progress}%`}
          </span>
        </div>
        <div className={props.fillWrapperClassName}>
          <div className={props.fillClassName} style={{
            width: `${props.progress}%`
          }} />
        </div>
        <div className={props.detailClassName}>
          {props.detail}
        </div>
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  className: 'progress-bar',
  decimalPrecision: 0,
  detailClassName: 'progress-bar-detail',
  headerClassName: 'progress-bar-header',
  fillClassName: 'progress-bar-fill',
  fillWrapperClassName: 'progress-bar-fill-wrapper',
  labelClassName: 'progress-bar-label',
  layoutClassName: '',
  progress: 0,
  progressClassName: 'progress-bar-progress'
};

ProgressBar.propTypes = {
  className: React.PropTypes.string,
  decimalPrecision: React.PropTypes.number,
  detail: React.PropTypes.node,
  detailClassName: React.PropTypes.string,
  headerClassName: React.PropTypes.string,
  fillClassName: React.PropTypes.string,
  fillWrapperClassName: React.PropTypes.string,
  label: React.PropTypes.node.isRequired,
  labelClassName: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
  progress: React.PropTypes.number.isRequired,
  progressClassName: React.PropTypes.string,
  precision: React.PropTypes.number,
  state: React.PropTypes.oneOf(['error', 'ongoing', 'success']).isRequired
};

module.exports = ProgressBar;
