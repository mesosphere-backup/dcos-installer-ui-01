import React from 'react';

module.exports = class IconLogomark extends React.Component {
  render() {
    return (
      <svg
        className="icon icon-logomark"
        viewBox="0 0 430 324"
        {...this.props}>
        <defs>
          <linearGradient id="linear-gradient" x1="5.9" y1="168.2" x2="425.8" y2="168.2" gradientTransform="matrix(1, 0, 0, -1, 0, 330)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#9351e5"/>
            <stop offset="1" stopColor="#ef468b"/>
          </linearGradient>
        </defs>
        <path style={{'fill': 'url(#linear-gradient)'}} d="M216,315c-6.6,0-12.8-3.6-17.1-9.8L130.5,204.1,34.2,263.4a21.37,21.37,0,0,1-11.5,3.5c-8.1,0-16.8-6-16.8-19.3V34.8A26.3,26.3,0,0,1,19.8,11.7c3.6-2.8,8.7-3.1,12.4-3.1H399.7c4.9,0,8.7.9,11.5,2.7a26.35,26.35,0,0,1,14.6,23.5V198.1c0,5.5-1.6,10.4-4.7,14a17.32,17.32,0,0,1-13.4,6.1h0a22.87,22.87,0,0,1-10.2-2.5l-78.1-38.5L232.9,305.1C228.8,311.4,222.6,315,216,315ZM145.5,194.9l67.9,100.4c1,1.5,2,2.1,2.6,2.1s1.6-.7,2.6-2.1l85.2-125.9-64.9-32ZM22.8,249.5v0h0ZM23.5,45.8V247.7c0,0.7.1,1.2,0.1,1.6a9,9,0,0,0,1.4-.7l95.7-59Zm306,116.8L405.4,200c2.1,1,2.7.7,2.7,0.7a7.62,7.62,0,0,0,.4-2.6V45.8ZM40.5,39.7l95.2,140.7,84.6-52.1Zm215.9,86.9,57.2,28.2L387.2,46ZM52.3,26l185.6,91.4L386.4,26H52.3Z"/>
      </svg>
    );
  }
}
