import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import FixedBar from '../components/FixedBar';
import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';
import NavigationItems from '../components/NavigationItems';
import NavigationNextStep from './NavigationNextStep';
import PreFlightStore from '../stores/PreFlightStore';

class NavigationBar extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {
        name: 'preFlight',
        events: ['stateFinish']
      }
    ];
  }

  getActiveRouteIndex(routes, activeRoute) {
    let activeRouteIndex = -1;

    routes.forEach((route, index) => {
      // We need to remove the prefixed slash when comparing path names.
      if (route.path === this.getActiveRoutePath(activeRoute)) {
        activeRouteIndex = index;
      }
    });

    return activeRouteIndex;
  }

  getActiveRoutePath(route) {
    return route.substr(1);
  }

  getNavigationItems(routes = [], activeRoute = '') {
    return routes.map((route, index) => {
      if (route.display) {
        let activeRouteIndex = this.getActiveRouteIndex(routes, activeRoute);
        let isActive = index === activeRouteIndex;
        let isRouteComplete = index < activeRouteIndex;
        let chevron = <IconChevron isComplete={isRouteComplete} />;
        let link = null;

        // Add a link back to the setup page when pre-flight is complete.
        if (this.getActiveRoutePath(activeRoute) === 'pre-flight'
          && route.path === 'setup' && PreFlightStore.isCompleted()) {
          link = '/setup';
        }

        return (
          <span key={index}>
            <NavigationItem isComplete={isRouteComplete} isActive={isActive}
              link={link}>
              {route.display}
            </NavigationItem>
            {chevron}
          </span>
        );
      }

      return null;
    });
  }

  render() {
    return (
      <FixedBar className="navigation-bar">
        <NavigationItems>
          {this.getNavigationItems(this.props.routes, this.props.activeRoute)}
        </NavigationItems>
        <NavigationNextStep />
      </FixedBar>
    );
  }
}

NavigationBar.defaultProps = {
  activeClassName: 'is-active',
  className: 'navigation-item',
  layoutClassName: ''
};

NavigationBar.propTypes = {
  activeRoute: React.PropTypes.string,
  routes: React.PropTypes.array.isRequired
};

module.exports = NavigationBar;
