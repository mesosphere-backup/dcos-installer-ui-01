import React from 'react';

class IconPasswordStrength extends React.Component {
  render() {
    let classes = 'icon icon-password-strength ' +
      this.props.supplementalClassName;

    return (
      <svg
        className={classes}
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <path className="bar bar-1" d="M1,5A1,1,0,0,1,3,5v6a1,1,0,0,1-2,0V5Z"/>
        <path className="bar bar-2" d="M5,5A1,1,0,0,1,7,5v6a1,1,0,0,1-2,0V5Z"/>
        <path className="bar bar-3" d="M9,5a1,1,0,0,1,2,0v6a1,1,0,0,1-2,0V5Z"/>
        <path className="bar bar-4" d="M13,5a1,1,0,0,1,2,0v6a1,1,0,0,1-2,0V5Z"/>
      </svg>
    );
  }
}

IconPasswordStrength.propTypes = {
  supplementalClassName: React.PropTypes.string
};

module.exports = IconPasswordStrength;
