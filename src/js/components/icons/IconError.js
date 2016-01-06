import React from 'react';

module.exports = class IconError extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-error"
        height="64px"
        viewBox="0 0 64 64"
        width="64px"
        {...this.props}>
        <path d="M32,64A32,32,0,1,1,64,32,32,32,0,0,1,32,64ZM32,2A30,30,0,1,0,62,32,30,30,0,0,0,32,2Z"/>
        <rect x="31" y="12" width="2" height="41" transform="translate(-13.61 32.15) rotate(-45)"/>
        <rect x="11.5" y="31.5" width="41" height="2" transform="translate(-13.61 32.15) rotate(-45)"/>
      </svg>
    );
  }
}
