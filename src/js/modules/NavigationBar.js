import React from 'react';

import FixedBar from '../components/FixedBar';
import NavigationItem from '../components/NavigationItem';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <FixedBar className="navigation-bar">
        <NavigationItem link="setup" label="Setup" />
        <NavigationItem link="pre-flight" label="Pre-Flight" />
        <NavigationItem link="deploy" label="Deploy" />
        <NavigationItem link="post-flight" label="Post-Flight" />
        <NavigationItem link="success" label="Success" />
      </FixedBar>
    );
  }
}

NavigationBar.propTypes = {
  children: React.PropTypes.node
};
