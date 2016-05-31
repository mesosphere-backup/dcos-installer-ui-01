import React from 'react';

module.exports = class IconErrorSmall extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-error"
        height="12px"
        viewBox="0 0 12 12"
        width="12px"
        {...this.props}>
        <path d="M6 1C3.24 1 1 3.243 1 6c0 2.76 2.243 5 5 5 2.76 0 5-2.243 5-5 0-2.76-2.243-5-5-5zm0-1c3.307 0 6 2.686 6 6 0 3.307-2.686 6-6 6-3.307 0-6-2.686-6-6 0-3.307 2.686-6 6-6z" />
        <path d="M5.25 3h1.5l-.375 3.75h-.75L5.25 3zM6 9c.414 0 .75-.336.75-.75S6.414 7.5 6 7.5s-.75.336-.75.75S5.586 9 6 9z" />
      </svg>
    );
  }
}
