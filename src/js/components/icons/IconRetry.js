import React from 'react';

module.exports = class IconRetry extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-retry"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <path d="M4,2.66a7,7,0,1,0,7.28-.46L10.57,4.1a5,5,0,1,1-5.44.19l1.43,2L8.65,0.61H2.55Z"/>
      </svg>
    );
  }
}
