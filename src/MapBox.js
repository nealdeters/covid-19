import React from 'react';
import mapboxgl from 'mapbox-gl';
import './MapBox.scss';
import covid from './covid';
import MapBoxService from './MapBoxService';
import UtilityService from './UtilityService';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

class MapBox extends React.Component {
	componentDidMount() {
	  this.map = new mapboxgl.Map({
	    container: this.mapContainer,
	    style: 'mapbox://styles/mapbox/light-v10',
	    center: [-98, 38],
	    zoom: 3.5
	  });

	  let nav = new mapboxgl.NavigationControl();
		this.map.addControl(nav, 'top-left');

	  this.map.on('load', () => {
	    let map = this.map;

	    // load and prepare data
	    const date = UtilityService.getYesterday();

	    // define type and query params
	    const type = "reports";
	    const query = {
	      date: date
	    }

	    // request from covid api
	    covid.request(type, query)
	    .then(response => {
	      const data = response.data;
	      MapBoxService.addMapLayers(map, data);
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
        <nav id="menu"></nav>
        <div id="mapbox" ref={el => this.mapContainer = el} />
      </React.Fragment>
    );
  }
}

export default MapBox;