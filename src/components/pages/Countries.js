import React, { Fragment, useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterList from './FilterList';
import TotalsTable from './TotalsTable';
import CovidContext from '../../context/covid/covidContext';
import UtilityService from '../../utils/UtilityService';

import './Countries.scss';

const Countries = () => {
  const covidContext = useContext(CovidContext);

  const [countryList, setCountryList] = useState(null);
  const [current, setCurrent] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false);

  const { 
    regions,
    globalData,
    getRegions,
    getCountry,
    getCountryList,
    getGlobalData,
    loading
  } = covidContext;

  useEffect(() => {
    if(regions === null){
      getRegions();

      // get global data
      getGlobalData();
    } else {
      let filtered = getCountryList();
      setCountryList(filtered);
      setFiltered(filtered);
    }

    // on dismount
    return () => {

    };

    // eslint-disable-next-line
  }, [regions]);

  const handleChange = (e) => {
    let text = e.target.value.toLowerCase();
    let uFiltered = countryList.filter(item => {
      return item.label.toLowerCase().search(
        text) !== -1;
    });

    setFiltered(uFiltered);
  }

  const handleClick = async (e) => {
    let iso = e.target.dataset.current;
    let country = await getCountry(iso);

    if(country.length > 1){
      setMoreInfo(true);
    }

    let totals = UtilityService.getTotals(iso, country);
    setCurrent(iso);
    setCountryData(totals);
  }

  return (
    <Fragment>
      <Container fluid>
        <Row>
          <Col md="2">
            <FilterList 
              filtered={filtered}
              handleChange={handleChange}
              handleClick={handleClick}
              filterPlaceholder="Search Countries..." />
          </Col>
          <Col md="10">
            <TotalsTable 
                data={globalData} 
                header="Global Totals"
                loading={loading}
                route={null} />
            <br />
            <TotalsTable 
                data={countryData} 
                header={countryData ? `${countryData.name} Totals` : null}
                loading={loading}
                moreInfo={moreInfo}
                route={`/countries/${current}`} />
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Countries;