import React from 'react';

module.exports = class IconInfo extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-chevron"
        height="10px"
        viewBox="0 0 7 10"
        width="7px"
        {...this.props}>
        <polygon points="1.71 0.29 0.29 1.71 3.59 5.01 0.29 8.29 1.71 9.71 6.41 5.01 1.71 0.29"/>
      </svg>
    );
  }
}
