import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './components/layout/Navigation';
import MapBox from './components/pages/MapBox';
import Countries from './components/pages/Countries';
import Provinces from './components/pages/Provinces';
import CovidState from './context/covid/CovidState';

class App extends React.Component {
  render() {
    return (
      <CovidState>
        <Router>
          <React.Fragment>
            <Navigation />
            <Switch>
              <Route exact path="/" component={MapBox} />
              <Route exact path="/countries" component={Countries} />
              <Route exact path="/countries/:country" component={Provinces} />
            </Switch>
          </React.Fragment>
        </Router>
      </CovidState>
    );
  }
}

export default App;