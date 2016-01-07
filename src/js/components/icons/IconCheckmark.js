import React from 'react';

module.exports = class IconCheckmark extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-checkmark"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <polygon points="5 13.53 0.65 9.18 1.35 8.47 5 12.12 14.65 2.47 15.35 3.18 5 13.53"/>
      </svg>
    );
  }
}
