import classnames from 'classnames';
import React from 'react';

class Page extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName,
      `${this.props.className}-${this.props.size}`, {
        [`page-${this.props.pageName}`]: this.props.pageName,
        'has-navigation-bar': this.props.hasNavigationBar,
        'is-inverted': this.props.inverse
      }
    );

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

Page.defaultProps = {
  className: 'page',
  layoutClassName: 'flex-box flex-box-align-horizontal-center ' +
    'flex-box-align-vertical-center',
  size: 'small'
};

Page.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hasNavigationBar: React.PropTypes.bool,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string,
  pageName: React.PropTypes.string,
  size: React.PropTypes.oneOf(['small', 'medium', 'large'])
};

module.exports = Page;
