import React, { Fragment, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterList from './FilterList';
import TotalsTable from './TotalsTable';
import CountryContext from '../../context/country/countryContext';
import './Countries.scss';

const Countries = () => {
  const countryContext = useContext(CountryContext);
  const { 
    filtered, 
    globalData, 
    currentData, 
    getCountries, 
    filterCountries, 
    getData,
    loading,
    clearData
  } = countryContext;

  // on mount get countries and global data from countryState
  useEffect(() => {
    // get countries list
    getCountries();

    // get global data
    getData();

    // on dismount
    return () => {
      clearData();
      
      if(currentData){
        clearData(true);
      }
    };

    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    filterCountries(e.target.value.toLowerCase());
  }

  const handleClick = (e) => {
    let current = e.target.dataset.current;
    clearData(true);
    getData(current);
  }

  return (
    <Fragment>
      <Container fluid>
        <Row>
          <Col md="2">
            <FilterList 
              filtered={filtered}
              handleChange={handleChange}
              handleClick={handleClick} />
          </Col>
          <Col md="10">
            <TotalsTable 
                data={globalData} 
                header="Global Totals"
                loading={loading} />
            <TotalsTable 
                data={currentData} 
                header={currentData ? `${currentData.name} Totals` : null}
                loading={loading} />
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Countries;