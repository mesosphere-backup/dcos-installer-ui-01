import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div className="application">
        {this.props.children}
      </div>
    );
  }
}
