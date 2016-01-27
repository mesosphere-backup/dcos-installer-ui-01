import React from 'react';

module.exports = class IconCloseSmall extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-close-small"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
        {...this.props}>
        <polygon points="12.95 4.46 11.54 3.05 8 6.59 4.46 3.05 3.05 4.46 6.59 8 3.05 11.54 4.46 12.95 8 9.41 11.54 12.95 12.95 11.54 9.41 8 12.95 4.46"/>
      </svg>
    );
  }
}
