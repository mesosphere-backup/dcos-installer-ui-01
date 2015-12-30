import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div className="application-wrapper flex-box flex-box-fit-height">
        {this.props.navigationBar}
        {this.props.view}
      </div>
    );
  }
}

Application.propTypes = {
  children: React.PropTypes.node,
  navigationBar: React.PropTypes.node,
  view: React.PropTypes.node
};
