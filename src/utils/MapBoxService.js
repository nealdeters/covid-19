import UtilityService from './UtilityService';

const MapBoxService = {
	addMapLayers: (map, data) => {
		const geoData = MapBoxService.convertToGeoJson(data);
		
	  map.addSource('covid', {
	    'type': 'geojson',
	    'data': geoData,
	  });

	  let layers = [
	    {label: 'Fatality Rate', property: 'fatality_rate', visible: true},
	    {label: 'Confirmed', property: 'confirmed', visible: false},
	    {label: 'Active', property: 'active', visible: false},
	    {label: 'Recovered', property: 'recovered', visible: false}, 
	    {label: 'Deaths', property: 'deaths', visible: false}
	  ];
	  layers.forEach(layer => {
	    map.addLayer(MapBoxService.getLayer(layer.property, 'symbol', 'covid'));
	    MapBoxService.setLayerVisibility(map, layer);

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
	        MapBoxService.setLayerVisibility(map, layer);
	      })
	    };
	    
	    let buttons = document.getElementById('menu');
	    buttons.appendChild(button);
	  });
	},
	getLayer: (property, type, source) => {
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
  },
  setLayerVisibility: (map, layer) => {
    map.setLayoutProperty(layer.property, 'visibility', layer.visible ? 'visible' : 'none');
  },
	convertToGeoJson: (data) => {
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
	        confirmed: UtilityService.addCommas(point.confirmed),
	        recovered: UtilityService.addCommas(point.recovered),
	        province: UtilityService.addCommas(point.region.province),
	        country: UtilityService.addCommas(point.region.name),
	        deaths: UtilityService.addCommas(point.deaths),
	        confirmed_diff: UtilityService.addCommas(point.confirmed_diff),
	        deaths_diff: UtilityService.addCommas(point.deaths_diff),
	        recovered_diff: UtilityService.addCommas(point.recovered_diff),
	        active: UtilityService.addCommas(point.active),
	        active_diff: UtilityService.addCommas(point.active_diff),
	        fatality_rate: UtilityService.toPercentage(point.fatality_rate)
	      }
	    }
	    geoData.features.push(feature);
	  });

	  return geoData;
	}
}

export default MapBoxService;