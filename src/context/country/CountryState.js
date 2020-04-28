import React, { useReducer } from 'react';
import CountryContext from './countryContext';
import countryReducer from './countryReducer';
import UtilityService from '../../utils/UtilityService';
import CovidService from '../../utils/CovidService';
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

const CountryState = props => {
  const initialState = {
    countries: null,
    filtered: null,
    globalData: null,
    currentData: null,
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
        payload: err.message
      });
    }
  }

  const getData = async (iso) => {
    setLoading();

    try {
      const date = UtilityService.getYesterday();
      const type = iso ? 'reports' : 'reports/total';
      const query = iso ? {
        iso: iso
      } : {
        date: date
      }
      const res = await CovidService.request(type, query);
      const data = res.data;
      console.log(data)
      let total;
      if(iso){
        total = {
          active: 0,
          active_diff: 0,
          confirmed: 0,
          confirmed_diff: 0,
          recovered: 0,
          recovered_diff: 0,
          deaths: 0,
          deaths_diff: 0,
          fatality_rate: 0,
          name: null
        }

        data.forEach(province => {
          total.active += province.active;
          total.confirmed += province.confirmed;
          total.recovered += province.recovered;
          total.deaths += province.deaths;
          total.fatality_rate += province.fatality_rate;
          total.active_diff += province.active_diff;
          total.confirmed_diff += province.confirmed_diff;
          total.recovered_diff += province.recovered_diff;
          total.deaths_diff += province.deaths_diff;

          if(!total.name){
            total.name = province.region.name
          }
        })

        total.fatality_rate = total.fatality_rate / data.length;
      } else {
        total = data;
      }

      for(let key in total){
        if(key === 'fatality_rate'){
          total[key] = UtilityService.toPercentage(total[key]);
        } else {
          if(typeof total[key] === 'number'){
            total[key] = UtilityService.addCommas(total[key] > 0 ? total[key] : 0);
          }
        } 
      }

      if(iso){
        dispatch({
          type: GET_CURRENT_DATA,
          payload: total
        });
      } else {
        dispatch({
          type: GET_GLOBAL_DATA,
          payload: total
        });
      }
    } catch(err) {
      dispatch({ 
        type: COUNTRIES_ERROR,
        payload: err.message
      });
    }
  }

  const clearData = (clearCurrent) => {
    if(clearCurrent){
      dispatch({
        type: CLEAR_CURRENT_DATA
      });
    } else {
      dispatch({
        type: CLEAR_GLOBAL_DATA
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

  return (
    <CountryContext.Provider
      value={{
        countries: state.countries,
        filtered: state.filtered,
        current: state.current,
        loading: state.loading,
        error: state.error,
        globalData: state.globalData,
        currentData: state.currentData,
        getCountries,
        filterCountries,
        getData,
        setLoading,
        clearData
      }}
    >
      {props.children}
    </CountryContext.Provider>
  );
};

export default CountryState;