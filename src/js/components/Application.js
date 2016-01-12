import classnames from 'classnames';
import React from 'react/addons';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

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
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        <NavigationBar />
        <CSSTransitionGroup
          transitionName={`page-transition-${this.state.transitionDirection}`}
          component="div" className={'page-transition-wrapper flex-box ' +
          'flex-box-align-vertical-center flex-box-align-horizontal-center'}>
          <div className={'page-transition-container flex-box ' +
            'flex-box-align-vertical-center flex-box-align-horizontal-center ' +
            'page-transition-container'} key={this.props.location.pathname}>
            {this.props.children}
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}

Application.defaultProps = {
  className: 'application-wrapper',
  layoutClassName: 'flex-box flex-box-fit-height'
};

Application.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  location: React.PropTypes.object,
  layoutClassName: React.PropTypes.string,
  route: React.PropTypes.object,
  view: React.PropTypes.node
};

module.exports = Application;
