import classnames from 'classnames';
import React from 'react';

class NavigationItems extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

NavigationItems.defaultProps = {
  className: 'navigation-items',
  layoutClassName: ''
};

NavigationItems.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = NavigationItems;
