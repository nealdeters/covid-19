import React, { useReducer } from 'react';
import CovidContext from './covidContext';
import covidReducer from './covidReducer';
import UtilityService from '../../utils/UtilityService';
import CovidService from '../../utils/CovidService';
import {
  GET_REGIONS,
  GET_GLOBAL_DATA,
  SET_LOADING,
  ERROR
} from '../types';

const CovidState = props => {
  const initialState = {
    regions: null,
    globalData: null,
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
        type: ERROR,
        payload: err.message
      });
    }
  }

  const getGlobalData = async (iso) => {
    setLoading();

    try {
      const date = UtilityService.getYesterday();
      const type = 'reports/total';
      const query = {
        date: date
      }
      const res = await CovidService.request(type, query);
      const data = res.data;
      let total = UtilityService.getTotals(iso, data);
      console.log(total)
      dispatch({
        type: GET_GLOBAL_DATA,
        payload: total
      });
    } catch(err) {
      dispatch({ 
        type: ERROR,
        payload: err.message
      });
    }
  }

  const filterData = (key, val, data) => {
    return data.filter(item => {
      return item.region[key] === val;
    })
  } 

  let country = null;
  const getCountry = async (iso) => {
    if(state.regions === null){
      await getRegions();
      country = filterData('iso', iso, state.regions);
      return country;
    } else {
      country = filterData('iso', iso, state.regions);
      return country;
    }
  }

  const getCountryList = () => {
    let list = [];
    
    state.regions.forEach(item => {
      const country = {key: item.region.iso, label: item.region.name };
      const exists = list.find(cntry => {
        return cntry.key === country.key;
      })

      if(!exists){
        list.push(country);
      }
    })

    return list;
  }

  const getProvinceList = (country) => {
    let list = [];
    for(const key in country){
      const val = country[key];
      const province = {key: val.region.province, label: val.region.province}
      const exists = list.find(cntry => {
        return cntry.key === province.key;
      })
      if(!exists){
        list.push(province);
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

    return list;
  }

  const getProvince = async (iso, province) => {
    const country = await getCountry(iso);
    return filterData('province', province, country);
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
        globalData: state.globalData,
        loading: state.loading,
        error: state.error,
        getRegions,
        getGlobalData,
        setLoading,
        getCountry,
        getCountryList,
        getProvince,
        getProvinceList
      }}
    >
      {props.children}
    </CovidContext.Provider>
  );
};

export default CovidState;