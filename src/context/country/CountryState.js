import React, { useReducer } from 'react';
import CountryContext from './countryContext';
import countryReducer from './countryReducer';
import UtilityService from '../../utils/UtilityService';
import CovidService from '../../utils/CovidService';
import {
  GET_COUNTRIES,
  FILTER_COUNTRIES,
  SET_CURRENT,
  CLEAR_CURRENT,
  SET_LOADING,
  COUNTRIES_ERROR
} from '../types';

const CountryState = props => {
  const initialState = {
    countries: null,
    filtered: null,
    current: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(countryReducer, initialState);

  const getCountries = async () => {
    setLoading();

    try {
      const date = UtilityService.getYesterday();
      const type = 'reports';
      const query = {
        date: date
      }

      const res = await CovidService.request(type, query)
      const data = res.data;
      let list = [];
      for(const key in data){
        const val = data[key];
        const country = {key: val.region.iso, label: val.region.name}
        const exists = list.find(cntry => {
          return cntry.key === country.key;
        })
        if(!exists){
          list.push(country);
        }
      }
      list.sort( (a, b) => {
        const labelA = a.label.toUpperCase();
        const labelB = b.label.toUpperCase();
        if (labelA < labelB) return -1;
        if (labelA > labelB) return 1;

        // names must be equal
        return 0;
      });

      dispatch({ 
        type: GET_COUNTRIES,
        payload: list
      });
    } catch (err) {
      dispatch({ 
        type: COUNTRIES_ERROR,
        payload: err.response.msg
      });
    }
  }

  const filterCountries = (val) => {
    dispatch({
      type: FILTER_COUNTRIES,
      payload: val
    });
  }

  const setLoading = () => {
    dispatch({ 
      type: SET_LOADING
    });
  }

  const setCurrent = (item) => {
    dispatch({ 
      type: SET_CURRENT,
      payload: item
    });
  };

  const clearCurrent = () => {
    dispatch({ 
      type: CLEAR_CURRENT
    });
  };

  return (
    <CountryContext.Provider
      value={{
        countries: state.countries,
        filtered: state.filtered,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getCountries,
        filterCountries,
        setLoading,
        setCurrent,
        clearCurrent
      }}
    >
      {props.children}
    </CountryContext.Provider>
  );
};

export default CountryState;