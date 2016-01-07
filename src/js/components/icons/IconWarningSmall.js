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
        <path d="M8.9,1.77c-0.49-1-1.3-1-1.79,0L1.4,13.18A1.14,1.14,0,0,0,2.49,15h11a1.14,1.14,0,0,0,1.09-1.79ZM13.51,14h-11a1.16,1.16,0,0,1-.28,0h0a0.57,0.57,0,0,1,.08-0.31L8,2.22H8l5.71,11.41a1.53,1.53,0,0,1,.1.29A0.55,0.55,0,0,1,13.51,14Z" fill-rule="evenodd"/>
        <rect x="7.5" y="11.97" width="1" height="1"/>
        <rect x="7.5" y="6.47" width="1" height="4.5"/>
      </svg>
    );
  }
}
