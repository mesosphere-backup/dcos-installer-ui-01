import classnames from 'classnames';
import {Link} from 'react-router';
import React from 'react';

class NavigationItem extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName, {
      [this.props.activeClassName]: this.props.isActive
    });

    let navigationItem = (
      <div className={classes} activeClassName={this.props.activeClassName}>
        {this.props.children}
      </div>
    );

    if (this.props.link) {
      navigationItem = (
        <Link className={classes} to={this.props.link}>
          {this.props.children}
        </Link>
      );
    }

    return navigationItem;
  }
}

NavigationItem.defaultProps = {
  activeClassName: 'is-active',
  className: 'navigation-item',
  layoutClassName: ''
};

NavigationItem.propTypes = {
  activeClassName: React.PropTypes.string,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  isActive: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string,
  link: React.PropTypes.string
};

module.exports = NavigationItem;
