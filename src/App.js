import React from 'react';
import './App.scss';
import Articles from './Articles';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ReactMapGL from 'react-map-gl';

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COVID-19</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#news">News</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

function App() {
  // setup map
  const [viewport, setViewport] = React.useState({
    latitude: 38,
    longitude: -98,
    width: "100vw",
    height: "90vh",
    zoom: 4,
    // style: 'mapbox://styles/mapbox/streets-v11'
  });
  const mapRef = React.useRef();

  // load and prepare data
  // get map bounds
  // get clusters

  // return map
  return (
    <React.Fragment>
      <Navigation />
      <ReactMapGL
        {...viewport}
        maxZoom={20}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
        onViewportChange={newViewport => {
          setViewport({ ...newViewport });
        }}
        ref={mapRef}
      >
        {/* markers here */}
      </ReactMapGL>
    </React.Fragment>
  );
}

export default App;
