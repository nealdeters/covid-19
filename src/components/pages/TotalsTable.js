import React from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'
import './TotalsTable.scss';

const TotalsTable = ({ data, loading, header, route, moreInfo}) => {
  const labels = {
    active: 'Active',
    confirmed: 'Confirmed',
    recovered: 'Recovered',
    deaths: 'Deaths',
    fatality_rate: 'Fatality Rate'
  }

  const spinning = (
    <Spinner animation="border" role="status" variant="dark" >
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  return ( 
    <div className="totals">
      { header ? (<h1>{header}</h1>) : null }
      { data && !loading && route !== null && moreInfo ? (<Button variant="secondary" as={Link} to={route}>More Info</Button>) : null }

      { !data && !loading ? 
        null 
        : !data && loading ? (
        spinning
      ) : (
        <div>
          <h2>Yesterday</h2>
          <Table responsive striped bordered hover size="sm">
            <thead>
              <tr>
                <th>{labels.active}</th>
                <th>{labels.confirmed}</th>
                <th>{labels.recovered}</th>
                <th>{labels.deaths}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.active_diff}</td>
                <td>{data.confirmed_diff}</td>
                <td>{data.recovered_diff}</td>
                <td>{data.deaths_diff}</td>
              </tr>
            </tbody>
          </Table>

          <h2>Overall</h2>
          <Table responsive striped bordered hover size="sm">
            <thead>
              <tr>
                <th>{labels.active}</th>
                <th>{labels.confirmed}</th>
                <th>{labels.recovered}</th>
                <th>{labels.deaths}</th>
                <th>{labels.fatality_rate}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.active}</td>
                <td>{data.confirmed}</td>
                <td>{data.recovered}</td>
                <td>{data.deaths}</td>
                <td>{data.fatality_rate}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default TotalsTable;