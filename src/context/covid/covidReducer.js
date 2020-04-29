import {
  GET_REGIONS,
  SET_LOADING,
  GET_GLOBAL_DATA,
  ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_REGIONS:
    	return {
    		...state,
    		regions: action.payload,
    		loading: false
    	};
    case GET_GLOBAL_DATA:
      return {
        ...state,
        globalData: action.payload,
        loading: false
      };
    case SET_LOADING:
    	return {
    		...state,
    		loading: true
    	}
    case ERROR:
    	console.error(action.payload);
    	return {
    		...state,
    		error: action.payload,
    		loading: false
    	};
    default:
      return state;
  };
};