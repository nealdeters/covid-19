import React, { Fragment, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterList from './FilterList';
import TotalsTable from './TotalsTable';
import CountryContext from '../../context/country/countryContext'
import './Countries.scss';

// TotalsTable
  // data

const Countries = () => {

  const countryContext = useContext(CountryContext);
  const { filtered, getCountries, filterCountries, setCurrent, clearCurrent } = countryContext;

  // on mount get countries and global data from countryState
  useEffect(() => {
    getCountries();

    return () => {
      clearCurrent();
    };

    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    filterCountries(e.target.value.toLowerCase());
  }

  const handleClick = (e) => {
    let current = e.target.dataset.current;
    setCurrent(current);
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
            <TotalsTable global="true" />
            <TotalsTable />
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Countries;