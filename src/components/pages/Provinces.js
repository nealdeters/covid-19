import React, { Fragment, useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterList from './FilterList';
import TotalsTable from './TotalsTable';
import CovidContext from '../../context/covid/covidContext';
import UtilityService from '../../utils/UtilityService';

const Provinces = ({ match }) => {
  const covidContext = useContext(CovidContext);

  const { regions, loading, getRegions, getCountry, getProvinceList, getProvince } = covidContext;

  const [provinceList, setProvinceList] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);

  // on mount
  useEffect(() => {
    if(regions === null){
      getRegions();
    } else {
      let iso = match.params.iso;
      getCountry(iso).then(country => {
        let filtered = getProvinceList(country);

        let totals = UtilityService.getTotals(iso, country);
        setCountryData(totals);

        setProvinceList(filtered);
        setFiltered(filtered);
      });
    }

    // eslint-disable-next-line
  }, [regions]);

  const handleChange = (e) => {
    // filter the provinces
    let text = e.target.value.toLowerCase();
    let uFiltered = provinceList.filter(item => {
      return item.label.toLowerCase().search(
        text) !== -1;
    });

    setFiltered(uFiltered);
  }

  const handleClick = async (e) => {
    let current = e.target.dataset.current;
    let iso = match.params.iso;
    let province = await getProvince(iso, current);
    let totals = UtilityService.getTotals(iso, province);
    setProvinceData(totals);
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
              filterPlaceholder="Search Provinces..." />
          </Col>
          <Col md="10">
            <TotalsTable 
                data={countryData} 
                header={countryData ? `${countryData.name} Totals` : null}
                loading={loading}
                route={null} />
            <TotalsTable 
                data={provinceData} 
                header={provinceData ? `${provinceData.subName} Totals` : null}
                loading={loading}
                route={null} />
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Provinces;