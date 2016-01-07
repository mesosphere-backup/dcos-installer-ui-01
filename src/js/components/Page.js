import classnames from 'classnames';
import React from 'react';

class Page extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName, {
      'has-navigation-bar': this.props.hasNavigationBar,
      'is-inverted': this.props.inverse
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

Page.defaultProps = {
  className: 'page-wrapper',
  layoutClassName: 'flex-box flex-box-align-horizontal-center ' +
    'flex-box-align-vertical-center'
};

Page.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hasNavigationBar: React.PropTypes.bool,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string
};

module.exports = Page;
