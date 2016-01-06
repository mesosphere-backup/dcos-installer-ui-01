import React from 'react';

module.exports = class IconWarning extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-warning"
        height="64px"
        viewBox="0 0 64 64"
        width="64px"
        {...this.props}>
        <path d="M34.87,7.23c-1.59-2.91-4.15-2.91-5.74,0L3.87,53.68C2.28,56.6,3.69,59,7,59H57c3.32,0,4.72-2.36,3.13-5.27ZM58.68,56.39A2,2,0,0,1,57,57H7a2,2,0,0,1-1.68-.57,2,2,0,0,1,.31-1.75L30.89,8.18A1.93,1.93,0,0,1,32,7a1.93,1.93,0,0,1,1.11,1.14L58.37,54.64A2,2,0,0,1,58.68,56.39Z" fill-rule="evenodd"/>
        <rect x="31" y="44.96" width="2" height="4"/>
        <rect x="31" y="22.96" width="2" height="18"/>
      </svg>
    );
  }
}
