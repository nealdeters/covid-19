import React from 'react';
import './App.scss';
// import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import mapboxgl from 'mapbox-gl';
import covidRequest from './covidRequest';

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COVID-19</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#news">News</Nav.Link>
        </Nav>
      </Navbar.Collapse> */}
    </Navbar>
  )
}

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

class App extends React.Component {
  componentDidMount() {
    // load and prepare data
    // get yestedays date in iso format
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().slice(0,10);

    // define type and query params
    const type = "reports";
    const query = {
      // region_province: "Illinois",
      iso: "USA",
      date: date
    }

    let convertToGeoJson = (data) => {
      let geoData = {
        type: 'FeatureCollection',
        features: []
      };

      data.forEach(point => {
        let feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              point.region.long,
              point.region.lat
            ]
          },
          properties: {
            confirmed: point.confirmed
          }
        }
        geoData.features.push(feature);
      });

      return geoData;
    }

    // request from covid api
    covidRequest(type, query)
    .then(response => {
      return response.json();
    })
    .then(response => {
      const data = response.data;
      const geoData = convertToGeoJson(data);
      return geoData;
    })
    .catch(err => {
      console.log(err);
    })
    .then(data => {
      this.map.on('load', () => {
        this.map.addSource('covid', {
          'type': 'geojson',
          'data': data,
        });

        this.map.addLayer({
          'id': 'confirmed',
          'type': 'symbol',
          'source': 'covid',
          'layout': {
            'text-field': [
              'concat',
              ['to-string', ['get', 'confirmed']]
            ],
            'text-font': [
              'Open Sans Bold',
              'Arial Unicode MS Bold'
            ],
            'text-size': 12
          },
          'paint': {
            'text-color': 'rgba(0,0,0,0.5)'
          }
        });
      });
    });

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-98, 38],
      zoom: 3.75,
      // interactive: false
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <div id="mapbox" ref={el => this.mapContainer = el} />
      </React.Fragment>
    );
  }
}

export default App;
