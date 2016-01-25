import React from 'react';

module.exports = class IconWarningSmall extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-warning-small"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <path d="M8,0.5A7.5,7.5,0,1,0,15.5,8,7.5,7.5,0,0,0,8,.5Zm0,14A6.5,6.5,0,1,1,14.5,8,6.51,6.51,0,0,1,8,14.5Z"/>
        <rect x="7.5" y="10.5" width="1" height="1"/>
        <rect x="7.5" y="5" width="1" height="4.5"/>
      </svg>
    );
  }
}
