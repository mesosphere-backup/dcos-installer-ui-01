import {createHashHistory} from 'history';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';
import {Route, Router, useRouterHistory} from 'react-router';

require('./utils/StoreMixinConfig');

import Application from './components/Application';
import EnforceStage from './components/EnforceStage';
import Begin from './pages/Begin';
import Config from './config/Config';
import Deploy from './pages/Deploy';
import NotFound from './pages/NotFound';
import PluginSDK from 'PluginSDK';
import Postflight from './pages/Postflight';
import Preflight from './pages/Preflight';
import Setup from './pages/Setup';
import Success from './pages/Success';

PluginSDK.initialize(Config.pluginsConfig);

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

ReactDOM.render((
  <Router history={appHistory}>
    <Route component={EnforceStage}>
      <Route path="/" component={Begin} />
      <Route path="/" component={Application}>
        <Route path="setup" display="Setup" component={Setup} />
        <Route path="pre-flight" display="Pre-Flight" component={Preflight} />
        <Route path="deploy" display="Deploy" component={Deploy} />
        <Route path="post-flight" display="Post-Flight" component={Postflight} />
        <Route path="success" display="Success" component={Success} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('application'));
