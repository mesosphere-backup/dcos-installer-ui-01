import {browserHistory, IndexRoute, Route, Router} from 'react-router';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {render} from 'react-dom';

import Application from './modules/Application';
import Begin from './pages/Begin';
import Deploy from './pages/Deploy';
import NavigationBar from './modules/NavigationBar';
import NotFound from './pages/NotFound';
import Postflight from './pages/Postflight';
import Preflight from './pages/Preflight';
import Setup from './pages/Setup';
import Success from './pages/Success';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Application}>
      <IndexRoute components={{view: Begin}}/>
      <Route path="setup" components={{
        view: Setup,
        navigationBar: NavigationBar
      }}/>
      <Route path="pre-flight" components={{
        view: Preflight,
        navigationBar: NavigationBar
      }}/>
      <Route path="deploy" components={{
        view: Deploy,
        navigationBar: NavigationBar
      }}/>
      <Route path="post-flight" components={{
        view: Postflight,
        navigationBar: NavigationBar
      }}/>
      <Route path="success" components={{
        view: Success,
        navigationBar: NavigationBar
      }}/>
      <Route path="*" components={{
        view: NotFound,
        navigationBar: NavigationBar
      }}/>
    </Route>
  </Router>
), document.getElementById('application'));
