import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import NavigationBar from './NavigationBar';

class Application extends React.Component {
  constructor() {
    super();

    this.state = {
      transitionDirection: 'forward'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      transitionDirection: this.getPageTransitionDirection(
        this.props.location.pathname,
        nextProps.location.pathname
      )
    });
  }

  getPageTransitionDirection(currentRoute, nextRoute) {
    currentRoute = this.removeSlashPrefix(currentRoute);
    nextRoute = this.removeSlashPrefix(nextRoute);

    let currentRouteIndex = -1;
    let nextRouteIndex = -1;
    let routes = this.props.route.childRoutes;

    routes.forEach(function (route, index) {
      if (route.path === currentRoute) {
        currentRouteIndex = index;
      }
      if (route.path === nextRoute) {
        nextRouteIndex = index;
      }
    });

    if (currentRouteIndex <= nextRouteIndex) {
      return 'forward';
    } else if (currentRouteIndex > nextRouteIndex) {
      return 'backward';
    }
  }

  removeSlashPrefix(route) {
    if (route.charAt(0) === '/') {
      return route.substr(1);
    } else {
      return route;
    }
  }

  render() {
    return (
      <div className="application-wrapper flex-box flex-box-fit-height">
        <NavigationBar activeRoute={this.props.location.pathname}
          routes={this.props.route.childRoutes} />
        <ReactCSSTransitionGroup
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName={`page-transition-${this.state.transitionDirection}`}
          className={'page-transition-wrapper flex-box ' +
          'flex-box-align-vertical-center flex-box-align-horizontal-center'}>
          <div className={'page-transition-container flex-box ' +
            'flex-box-align-vertical-center flex-box-align-horizontal-center ' +
            'page-transition-container'} key={this.props.location.pathname}>
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Application.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
  view: React.PropTypes.node
};

module.exports = Application;
