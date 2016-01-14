import React from 'react';

import FixedBar from '../components/FixedBar';
import IconChevron from '../components/icons/IconChevron';
import NavigationItem from '../components/NavigationItem';
import NavigationItems from '../components/NavigationItems';
import NavigationNextStep from './NavigationNextStep';
import NavigationPreviousStep from './NavigationPreviousStep';

class NavigationBar extends React.Component {
  getNavigationItems(routes, activeRoute) {
    return routes.map(function (route, index) {

      if (route.display) {
        let chevron = <IconChevron />;
        let isActive = false;

        // We don't want to render the chevron for the last menu item. We are
        // subtracting two from routes.length because the last route is *.
        if (index >= routes.length - 2) {
          chevron = null;
        }

        // We need to remove the prefixed slash when comparing path names.
        if (activeRoute && route.path === activeRoute.substr(1)) {
          isActive = true;
        }

        return (
          <span key={index}>
            <NavigationItem isActive={isActive}>
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
        <NavigationPreviousStep />
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
