import React from 'react';

import FixedBar from '../components/FixedBar';
import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';
import NavigationItems from '../components/NavigationItems';
import NavigationNextStep from './NavigationNextStep';

class NavigationBar extends React.Component {
  getActiveRouteIndex(routes, activeRoute) {
    let activeRouteIndex = -1;

    routes.forEach(function (route, index) {
      // We need to remove the prefixed slash when comparing path names.
      if (route.path === activeRoute.substr(1)) {
        activeRouteIndex = index;
      }
    });

    return activeRouteIndex;
  }

  getNavigationItems(routes = [], activeRoute = '') {
    return routes.map((route, index) => {
      if (route.display) {
        let activeRouteIndex = this.getActiveRouteIndex(routes, activeRoute);
        let isActive = index === activeRouteIndex;
        let isRouteComplete = index < activeRouteIndex;
        let chevron = <IconChevron isComplete={isRouteComplete} />;

        // We don't want to render the chevron for the last menu item. We are
        // subtracting two from routes.length because the last route is *.
        if (index >= routes.length - 2) {
          chevron = null;
        }

        return (
          <span key={index}>
            <NavigationItem isComplete={isRouteComplete} isActive={isActive}>
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
