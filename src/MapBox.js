import React from 'react';
import covidRequest from './covidRequest';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

let addMapLayers = (map, data) => {
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
    {label: 'Confirmed', property: 'confirmed', visible: false},
    {label: 'Recovered', property: 'recovered', visible: false}, 
    {label: 'Deaths', property: 'deaths', visible: false}
  ];
  layers.forEach(layer => {
    map.addLayer(getLayer(layer.property, 'symbol', 'covid'));
    setLayerVisibility(map, layer);

    let button = document.createElement('button');
    button.href = '#';
    button.className = 'btn btn-sm ';
    button.textContent = layer.label;
    button.ref = layer.property;

    if(layer.visible){
    	button.className += 'btn-dark'
    } else {
    	button.className += 'btn-light'
    }
     
    button.onclick = function(e) {
      let nodes = e.target.parentNode.childNodes;
      nodes.forEach(element => {
      	element.classList.replace('btn-dark', 'btn-light');
      })

      let target = e.target;
      e.preventDefault();
      e.stopPropagation();
      layers.forEach(layer => {
        if(target.ref === layer.property){
          layer.visible = true;
        } else {
          layer.visible = false;
        }
        target.classList.replace('btn-light', 'btn-dark')
        setLayerVisibility(map, layer);
      })
    };
    
    let buttons = document.getElementById('menu');
    buttons.appendChild(button);
  });
}

let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        confirmed: numberWithCommas(point.confirmed),
        recovered: numberWithCommas(point.recovered),
        province: point.region.province,
        country: point.region.name,
        deaths: numberWithCommas(point.deaths),
        recovered: numberWithCommas(point.recovered),
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
	      addMapLayers(map, data);
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