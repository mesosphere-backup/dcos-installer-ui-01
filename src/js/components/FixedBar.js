import classnames from 'classnames';
import React from 'react';

class FixedBar extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
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

module.exports = FixedBar;
