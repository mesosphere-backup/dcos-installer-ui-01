import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';

import Application from './modules/Application';
import Deploy from './pages/Deploy';
import NotFound from './pages/NotFound';
import Postflight from './pages/Postflight';
import Preflight from './pages/Preflight';
import Setup from './pages/Setup';
import Success from './pages/Success';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Application}>
      <Route path="setup" component={Setup}/>
      <Route path="preflight" component={Preflight}/>
      <Route path="deploy" component={Deploy}/>
      <Route path="postflight" component={Postflight}/>
      <Route path="success" component={Success}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
), document.getElementById('application'));
