import classnames from 'classnames';
import React from 'react';

export default class Page extends React.Component {
  render() {
    let classes = classnames({
      'has-navigation-bar': this.props.hasNavigationBar,
      [this.props.className]: true,
      [this.props.layoutClassName]: true
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
  layoutClassName: React.PropTypes.string
};
