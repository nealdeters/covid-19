//import liraries
import React, { Component } from 'react';
import './MapBox.css';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

export default class MapBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -98,
      lat: 38,
      zoom: 4
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });
  }

  render() {
    return (
      <div>
        <div 
          ref={el => this.mapContainer = el} 
          className="mapContainer"
        />
      </div>
    )
  }
}
