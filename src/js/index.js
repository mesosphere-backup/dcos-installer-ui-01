import {browserHistory, IndexRoute, Route, Router} from 'react-router';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {render} from 'react-dom';

import Application from './modules/Application';
import Begin from './pages/Begin';
import Deploy from './pages/Deploy';
import NotFound from './pages/NotFound';
import Postflight from './pages/Postflight';
import Preflight from './pages/Preflight';
import Setup from './pages/Setup';
import Success from './pages/Success';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Application}>
      <IndexRoute components={Begin} />
      <Route path="setup" components={Setup} />
      <Route path="pre-flight" components={Preflight} />
      <Route path="deploy" components={Deploy} />
      <Route path="post-flight" components={Postflight} />
      <Route path="success" components={Success} />
      <Route path="*" components={NotFound} />
    </Route>
  </Router>
), document.getElementById('application'));
