import React, { useContext, useEffect, Fragment } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapBox.scss';
import MapBoxService from '../../utils/MapBoxService';
import CovidContext from '../../context/covid/covidContext';
import Spinner from 'react-bootstrap/Spinner';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

const MapBox = () =>  {
	const covidContext = useContext(CovidContext);
	const { regions, loading, getRegions } = covidContext;

	let mapContainer = '';

	// on mount and regions changes
	useEffect(() => {
	  let map = null;

	  if(regions === null){
  	  // if regions is empty, call for it
  	  getRegions();
	  } else {
		  // create mapbox
		  map = new mapboxgl.Map({
		    container: mapContainer,
		    style: 'mapbox://styles/mapbox/light-v10',
		    center: [-98, 38],
		    zoom: 3.5
		  });

		  // create mapbox navigation control
		  let nav = new mapboxgl.NavigationControl();
	  	map.addControl(nav, 'top-left');

	  	// on load of the map, add the regions as layers
	  	map.on('load', () => {
	  		MapBoxService.addMapLayers(map, regions);
	  	})
	  }

	  // on dismount remove the map
	  return () => {
      if(map){
      	map.remove();
      }
    };

	  // eslint-disable-next-line
	}, [regions]);

  return (
    <Fragment>
			{ regions === null && loading ? (
				<Spinner id="map-spinner" animation="border" role="status" variant="dark" >
				  <span className="sr-only">Loading...</span>
				</Spinner>
			) : (
				null
			)}
			<nav id="menu"></nav>
			<div id="mapbox" ref={ el => mapContainer = el }></div>
		</Fragment>
  );
}

export default MapBox;