import {
  GET_COUNTRIES,
  FILTER_COUNTRIES,
  SET_LOADING,
  COUNTRIES_ERROR,
  GET_CURRENT_DATA,
  GET_GLOBAL_DATA,
  CLEAR_CURRENT_DATA,
  CLEAR_GLOBAL_DATA
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
    case GET_GLOBAL_DATA:
      return {
        ...state,
        globalData: action.payload,
        loading: false
      };
    case GET_CURRENT_DATA:
      return {
        ...state,
        currentData: action.payload,
        loading: false
      };
    case SET_LOADING:
    	return {
    		...state,
    		loading: true
    	}
    case CLEAR_CURRENT_DATA:
      return {
        ...state,
        currentData: null
      };
    case CLEAR_GLOBAL_DATA:
      return {
        ...state,
        globalData: null
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