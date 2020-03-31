import React from 'react';
import {
  BrowserRouter as Router,
  // Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
// import { createHashHistory } from 'history';

import { Layout } from 'antd';
import { ContextState, AppStatus } from '_base/Context';
import Booting from '_base/Booting';
import Logging from '_base/Logging';
import Head from './Head';
import Demo from './Demo';

export default function renderRouter({ appStatus }: ContextState) {
  switch (appStatus) {
    case AppStatus.BOOTING:
      return <Booting />;
    case AppStatus.LOGGING:
      return <Logging />;
    case AppStatus.RUNNING:
      return (
        // <Router history={createHashHistory()}>
        <Router basename={ROUTER_BASENAME}>
          <Layout>
            <Route component={Head} />
            <Switch>
              <Route path={Demo.path} component={Demo} />
              <Redirect to={Demo.pathOf({ page: 12 })} />
            </Switch>
          </Layout>
        </Router>
      );
  }
}
