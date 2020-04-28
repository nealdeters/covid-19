import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './components/layout/Navigation';
import MapBox from './components/pages/MapBox';
import Countries from './components/pages/Countries';
import CovidState from './context/covid/CovidState';
import CountryState from './context/country/CountryState';

class App extends React.Component {
  render() {
    return (
      <CovidState>
        <CountryState>
          <Router>
            <React.Fragment>
              <Navigation />
              <Switch>
                <Route exact path="/" component={MapBox} />
                <Route exact path="/countries" component={Countries} />
              </Switch>
            </React.Fragment>
          </Router>
        </CountryState>
      </CovidState>
    );
  }
}

export default App;