import React from 'react';

import FixedBar from '../components/FixedBar';
import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';
import NavigationNextStep from './NavigationNextStep';

module.exports = class NavigationBar extends React.Component {
  render() {
    return (
      <FixedBar className="navigation-bar">
        <NavigationItem link="setup">
          Setup
        </NavigationItem>
        <IconChevron />
        <NavigationItem link="pre-flight">
          Pre-Flight
        </NavigationItem>
        <IconChevron />
        <NavigationItem link="deploy">
          Deploy
        </NavigationItem>
        <IconChevron />
        <NavigationItem link="post-flight">
          Post-Flight
        </NavigationItem>
        <IconChevron />
        <NavigationItem link="success">
          Success
        </NavigationItem>
        <NavigationNextStep />
      </FixedBar>
    );
  }
}
