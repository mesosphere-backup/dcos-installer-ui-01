import createHistory from 'history/lib/createHashHistory';
import {IndexRoute, Route, Router} from 'react-router';
import React from 'react';

require('./utils/StoreMixinConfig');

import Application from './components/Application';
import Begin from './pages/Begin';
import Deploy from './pages/Deploy';
import NotFound from './pages/NotFound';
import Postflight from './pages/Postflight';
import Preflight from './pages/Preflight';
import Setup from './pages/Setup';
import Success from './pages/Success';

let history = createHistory({
  queryKey: false
});

React.render((
  <Router history={history}>
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
