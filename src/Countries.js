import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import covid from './covid';
import UtilityService from './UtilityService';
import './Countries.scss';

// filter list on search
  // onchange handler
// on select of country will show new component below yesterday

// country data
// list country data
// select name will go to country page

// function ListItem(props) {
//   return <ListGroup.item>{props.label}</ListGroup.item>;
// }

class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      filteredCountries: [] 
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const date = UtilityService.getYesterday();
    const type = 'reports';
    const query = {
      date: date
    }
    covid.request(type, query)
    .then(response => {
      const data = response.data;
      let countries = [];
      for(const key in data){
        const val = data[key];
        const country = {iso: val.region.iso, label: val.region.name}
        const exists = countries.find(cntry => {
          return cntry.iso === country.iso;
        })
        if(!exists){
          countries.push(country);
        }
      }
      countries.sort( (a, b) => {
        const labelA = a.label.toUpperCase();
        const labelB = b.label.toUpperCase();
        if (labelA < labelB) return -1;
        if (labelA > labelB) return 1;

        // names must be equal
        return 0;
      });

      this.setState({countries: countries, filteredCountries: countries});
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleChange(e) {
    const filteredCountries = this.state.countries.filter(function(item){
      return item.label.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredCountries: filteredCountries});
  }

  render() {
    return (
      <React.Fragment>
        <div className="country">
          <input 
            className="search form-control"
            type="text" 
            placeholder="Search Countries..."
            onChange={this.handleChange}
          />
          <ListGroup variant="flush" className="list">
            {this.state.filteredCountries.map((country) =>
              <ListGroup.Item key={country.iso}>
                {country.label}
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </React.Fragment>
    );
  }
}

class GlobalTotals extends React.Component {
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
      }
    }
    this.labels = {
      active: 'Active',
      confirmed: 'Confirmed',
      recovered: 'Recovered',
      deaths: 'Deaths',
      fatality_rate: 'Fatality Rate'
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
        if(key === 'fatality_rate'){
          data[key] = UtilityService.toPercentage(data[key]);
        } else {
          if(typeof data[key] === 'number'){
            data[key] = UtilityService.addCommas(data[key]);
          }
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
        <div className="global">
          <h1>Totals</h1>

          <div>
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

            <h2>Overall</h2>
            <Table responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>{this.labels.active}</th>
                  <th>{this.labels.confirmed}</th>
                  <th>{this.labels.recovered}</th>
                  <th>{this.labels.deaths}</th>
                  <th>{this.labels.fatality_rate}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.total.active}</td>
                  <td>{this.state.total.confirmed}</td>
                  <td>{this.state.total.recovered}</td>
                  <td>{this.state.total.deaths}</td>
                  <td>{this.state.total.fatality_rate}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

class Countries extends React.Component {
  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md="2">
              <CountryList />
            </Col>
            <Col md="10">
              <GlobalTotals />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default Countries;