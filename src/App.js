import React from 'react';
import './App.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import mapboxgl from 'mapbox-gl';
import covidRequest from './covidRequest';

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COVID-19</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Map</Nav.Link>
          <Nav.Link href="#news">Tables</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

class App extends React.Component {
  componentDidMount() {
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
            confirmed: point.confirmed,
            recovered: point.recovered,
            province: point.region.province,
            country: point.region.name,
            deaths: point.deaths,
            recovered: point.recovered,
            confirmed_diff: point.confirmed_diff,
            deaths_diff: point.deaths_diff,
            recovered_diff: point.recovered_diff,
            active: point.active,
            active_diff: point.active_diff,
            fatality_rate: ((point.fatality_rate * 100).toFixed(2)).toString() + "%",
          }
        }
        geoData.features.push(feature);
      });

      return geoData;
    }

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-98, 38],
      zoom: 3.5
    });

    this.map.on('load', () => {
      let map = this.map;

      // load and prepare data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().slice(0,10);

      // define type and query params
      const type = "reports";
      const query = {
        // region_province: "Illinois",
        // iso: "USA",
        date: date
      }

      // request from covid api
      covidRequest(type, query)
      .then(response => {
        return response.json();
      })
      .then(response => {
        const data = response.data;
        const geoData = convertToGeoJson(data);

        map.addSource('covid', {
          'type': 'geojson',
          'data': geoData,
        });

        let getLayer = (property, type, source) => {
          return {
            'id': property,
            'type': type,
            'source': source,
            'layout': {
              'text-field': [
                'concat',
                ['to-string', ['get', property]]
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
          }
        }

        let setLayerVisibility = (map, layer) => {
          map.setLayoutProperty(layer.property, 'visibility', layer.visible ? 'visible' : 'none');
        }

        let layers = [
          {label: 'Fatality Rate', property: 'fatality_rate', visible: true},
          {label: 'Recovered', property: 'recovered', visible: false}, 
          {label: 'Deaths', property: 'deaths', visible: false}
        ];
        layers.forEach(layer => {
          map.addLayer(getLayer(layer.property, 'symbol', 'covid'));
          setLayerVisibility(map, layer);

          let link = document.createElement('a');
          link.href = '#';
          // link.className = layer.visible ? 'active' : '';
          link.textContent = layer.label;
          link.ref = layer.property;
           
          link.onclick = function(e) {
            let target = e.target;
            e.preventDefault();
            e.stopPropagation();
            layers.forEach(layer => {
              if(target.ref === layer.property){
                layer.visible = true;
              } else {
                layer.visible = false;
              }
              setLayerVisibility(map, layer);
            })
          };
          
          let links = document.getElementById('menu');
          links.appendChild(link);
        });
      })
      .catch(err => {
        console.log(err);
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <nav id="menu"></nav>
        <div id="mapbox" ref={el => this.mapContainer = el} />
      </React.Fragment>
    );
  }
}

export default App;
