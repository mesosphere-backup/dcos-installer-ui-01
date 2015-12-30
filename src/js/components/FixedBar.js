import React from 'react';

export default class FixedBar extends React.Component {
  render() {
    return (
      <div className={`${this.props.className} ${this.props.layoutClassName}`}>
        {this.props.children}
      </div>
    );
  }
}

FixedBar.defaultProps = {
  className: '',
  layoutClassName: 'fixed-bar flex-box flex-box-align-horizontal-center ' +
    'flex-box-align-vertical-center'
};

FixedBar.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};
