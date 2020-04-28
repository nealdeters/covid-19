import {
  GET_COUNTRIES,
  FILTER_COUNTRIES,
  SET_CURRENT,
  CLEAR_CURRENT,
  SET_LOADING,
  COUNTRIES_ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_COUNTRIES:
    	return {
    		...state,
    		countries: action.payload,
        filtered: action.payload,
    		loading: false
    	};
    case FILTER_COUNTRIES: 
      return {
        ...state,
        filtered: state.countries.filter(item => {
          return item.label.toLowerCase().search(
            action.payload) !== -1;
        }),
        loading: false
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
        loading: false
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
        loading: false
      }
    case SET_LOADING:
    	return {
    		...state,
    		loading: true
    	}
    case COUNTRIES_ERROR:
    	console.error(action.payload);
    	return {
    		...state,
    		error: action.payload,
    		loading: false
    	}
    default:
      return state;
  };
};