import React from 'react';
import './App.scss';
import MapBox from './MapBox';
import Navigation from './Navigation';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <MapBox />
      </React.Fragment>
    );
  }
}

export default App;
