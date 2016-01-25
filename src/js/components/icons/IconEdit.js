import React from 'react';

module.exports = class IconEdit extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-edit"
        height="16px"
        viewBox="0 0 16 17"
        width="17px"
        {...this.props}>
        <path d="M13.44,10.5v5h-13V0.5h10v1h-9v13h11v-4h1Z" fill-rule="evenodd"/>
        <path d="M13,0.5L4.54,9,4.42,12.5l3.66,0L16.56,4ZM15.15,4L13.44,5.74,11.32,3.62,13,1.91ZM7.66,11.52H5.45L5.53,9.41l5.08-5.09,2.12,2.12Z" fill-rule="evenodd"/>
      </svg>
    );
  }
}
