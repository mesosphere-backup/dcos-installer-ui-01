import React from 'react';

module.exports = class IconCircleCheckmarkSmall extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-circle-checkmark"
        height="12px"
        viewBox="0 0 12 12"
        width="12px"
        {...this.props}>
        <path d="M6 1C3.24 1 1 3.243 1 6c0 2.76 2.243 5 5 5 2.76 0 5-2.243 5-5 0-2.76-2.243-5-5-5zm0-1c3.307 0 6 2.686 6 6 0 3.307-2.686 6-6 6-3.307 0-6-2.686-6-6 0-3.307 2.686-6 6-6z" />
        <path d="M2.855 6.65l.707-.708 2.12 2.12-.706.708-2.12-2.12zm2.12.706L8.69 3.644l.707.707-3.712 3.713-.707-.707z" />
      </svg>
    );
  }
}
