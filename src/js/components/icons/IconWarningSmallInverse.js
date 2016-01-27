import React from 'react';

module.exports = class IconWarningSmallInverse extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-warning-small-inverse"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <path className="icon-warning-small-inverse-triangle" d="M7.08,1.74c0.51-1,1.32-1,1.83,0l5.89,11.48A1.13,1.13,0,0,1,13.72,15H2.28a1.12,1.12,0,0,1-1.09-1.79Z"/>
        <rect className="icon-warning-small-inverse-exclamation" x="7.5" y="12.01" width="1" height="1"/>
        <rect className="icon-warning-small-inverse-exclamation" x="7.5" y="6.51" width="1" height="4.5"/>
      </svg>
    );
  }
}
