import classnames from 'classnames';
import React from 'react';

import NavigationBar from './NavigationBar';
import Page from '../components/Page';

class PageWithNavigation extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <Page className={classes}>
        <NavigationBar />
        {this.props.children}
      </Page>
    );
  }
}

PageWithNavigation.defaultProps = {
  className: 'page-wrapper has-navigation-bar',
  layoutClassName: 'flex-box flex-box-align-horizontal-center ' +
    'flex-box-align-vertical-center'
};

PageWithNavigation.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = PageWithNavigation;
