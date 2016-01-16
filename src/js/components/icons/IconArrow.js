import React from 'react';

module.exports = class IconArrow extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-arrow"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <polygon style={{'fileRule': 'evenodd'}} points="9.73 1.73 9.03 2.42 14.11 7.51 0 7.51 0 8.49 14.11 8.49 9.03 13.57 9.73 14.27 16 8 9.73 1.73"/>
      </svg>
    );
  }
}
