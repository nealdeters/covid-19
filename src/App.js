import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Navigation from './Navigation';
import MapBox from './MapBox';
import Countries from './Countries';
import News from './News';

class App extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Navigation />
          <Switch>
            <Route exact path="/" component={MapBox} />
            <Route exact path="/countries" component={Countries} />
            <Route exact path="/news" component={News} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;