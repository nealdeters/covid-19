import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';
import Navigation from './Navigation';
import MapBox from './MapBox';
import Countries from './Countries';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Navigation />
      <Switch>
        <Route exact path="/" component={MapBox} />
        <Route exact path="/countries" component={Countries} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
