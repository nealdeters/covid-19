import React, { useReducer } from 'react';
import CovidContext from './covidContext';
import covidReducer from './covidReducer';
import UtilityService from '../../utils/UtilityService';
import CovidService from '../../utils/CovidService';
import {
  GET_REGIONS,
  SET_LOADING,
  REGIONS_ERROR
} from '../types';

const CovidState = props => {
  const initialState = {
    regions: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(covidReducer, initialState);

  const getRegions = async () => {
    setLoading();

    try {
      // load and prepare data
      const date = UtilityService.getYesterday();

      // define type and query params
      const type = "reports";
      const query = {
        date: date
      }

      const res = await CovidService.request(type, query);
      
      dispatch({ 
        type: GET_REGIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({ 
        type: REGIONS_ERROR,
        payload: err.response.msg
      });
    }
  }

  const setLoading = () => {
    dispatch({ 
      type: SET_LOADING
    });
  }

  return (
    <CovidContext.Provider
      value={{
        regions: state.regions,
        loading: state.loading,
        error: state.error,
        getRegions,
        setLoading
      }}
    >
      {props.children}
    </CovidContext.Provider>
  );
};

export default CovidState;