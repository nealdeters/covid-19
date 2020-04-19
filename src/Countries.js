import React from 'react';
import Table from 'react-bootstrap/Table';
import covid from './covid';
import UtilityService from './UtilityService';

// search bar to filter countries list
// list countries
function ListItem(props) {
  return <li>{props.label}</li>;
}

class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: {},
    };
  }

  componentDidMount() {
    const date = UtilityService.getYesterday();
    const type = 'reports';
    const query = {
      date: date
    }
    covid.request(type, query)
    .then(response => {
      let data = response.data;
      let countries = {};
      for(let key in data){
        let val = data[key];
        countries[val.region.iso] = val.region.name;
      }
      this.setState({countries: countries});
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Countries</h1>
        <input type="text" placeholder="Search Countries..."/>
        <ul>
          {Object.keys(this.state.countries).map((iso) =>
            <ListItem key={iso}
                      label={this.state.countries[iso]}
                      iso={iso} />
          )}
        </ul>
      </React.Fragment>
    );
  }
}

class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: {
        active: 0,
        active_diff: 0,
        confirmed: 0,
        confirmed_diff: 0,
        recovered: 0,
        recovered_diff: 0,
        deaths: 0,
        deaths_diff: 0,
        fatality_rate: 0
      },
      countries: []
    }
    this.labels = {
      active: 'Active',
      confirmed: 'Confirmed',
      recovered: 'Recovered',
      deaths: 'Deaths'
    }
  }

  componentDidMount() {
    // load and prepare data
    const date = UtilityService.getYesterday();

    // define type and query params
    const totalType = "reports/total";
    const totalQuery = {
      date: date
    }

    // request from covid api
    covid.request(totalType, totalQuery)
    .then(response => {
      const data = response.data;
      for(let key in data){
        if(typeof data[key] === 'number'){
          data[key] = UtilityService.addCommas(data[key]);
        }

        if(key === 'fatality_rate'){
          data[key] = UtilityService.toPercentage(data[key]);
        }
      }
      this.setState({total: data});
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <h1>Totals</h1>

          <h2>Overall</h2>
          <Table responsive striped bordered hover size="sm">
            <thead>
              <tr>
                <th>{this.labels.active}</th>
                <th>{this.labels.confirmed}</th>
                <th>{this.labels.recovered}</th>
                <th>{this.labels.deaths}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.total.active}</td>
                <td>{this.state.total.confirmed}</td>
                <td>{this.state.total.recovered}</td>
                <td>{this.state.total.deaths}</td>
              </tr>
            </tbody>
          </Table>

          <h2>Yesterday</h2>
          <Table responsive striped bordered hover size="sm">
            <thead>
              <tr>
                <th>{this.labels.active}</th>
                <th>{this.labels.confirmed}</th>
                <th>{this.labels.recovered}</th>
                <th>{this.labels.deaths}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.total.active_diff}</td>
                <td>{this.state.total.confirmed_diff}</td>
                <td>{this.state.total.recovered_diff}</td>
                <td>{this.state.total.deaths_diff}</td>
              </tr>
            </tbody>
          </Table>

          <CountryList/>
        </div>
      </React.Fragment>
    )
  }
}

export default Countries;