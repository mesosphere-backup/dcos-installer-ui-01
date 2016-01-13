import classnames from 'classnames';
import IconPasswordStrength from './icons/IconPasswordStrength';
import React from 'react';
import zxcvbn from 'zxcvbn';

class PasswordStrength extends React.Component {
  render() {
    let passwordStrength = zxcvbn(this.props.password || '').score;

    let classes = classnames(this.props.className,
      `strength-${passwordStrength}`);

    return (
      <IconPasswordStrength supplementalClassName={classes} />
    );
  }
}

PasswordStrength.defaultProps = {
  className: 'password-strength-indicator',
  password: ''
};

PasswordStrength.propTypes = {
  className: React.PropTypes.string,
  password: React.PropTypes.string
};

module.exports = PasswordStrength;
