import React from 'react';
import './App.scss';
import MapBox from './MapBox';
import Articles from './Articles';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
  return (
    <React.Fragment>
      <Navigation />
      <Articles />
      <MapBox lat={38} lng={-98} />
    </React.Fragment>
  );
}

export default App;
