import React from 'react';
import {
  BrowserRouter as Router,
  // Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
// import { createHashHistory } from 'history';

import { ContextState, AppStatus } from '_base/Context';
import Demo from './Demo';

export default function renderRouter({ appStatus }: ContextState) {
  switch (appStatus) {
    case AppStatus.BOOTING:
      return 'BOOTING...';
    case AppStatus.LOGGING:
      return 'LOGGINT...';
    case AppStatus.RUNNING:
      return (
        // <Router history={createHashHistory()}>
        <Router basename={ROUTER_BASENAME}>
          <Switch>
            <Route path={Demo.path} component={Demo} />
            <Redirect to={Demo.pathOf({ page: 12 })} />
          </Switch>
        </Router>
      );
  }
}
