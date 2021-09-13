import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider, createTheme } from '../node_modules/@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/blue';
import { Registration, RegistrationComplete} from "./views";

import "./App.css";
import { getAppInsights } from './components/common/appInsights';
import TelemetryProvider from './components/common/telemetryProvider';

const history = createBrowserHistory();

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: blue,
    secondary: pink
  }
})


function App() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
        <TelemetryProvider instrumentationKey="<put your instrumentation key here>" activate={() => { getAppInsights() }}>
              <Switch>
                <Route exact path="/" component={Registration} />
                <Route exact path="/RegistrationComplete/:code" component={RegistrationComplete} />
              </Switch>
          </TelemetryProvider>
        </Router>
      </ThemeProvider>
    </div >

  );
}

export default App;
