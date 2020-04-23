import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import CovidService from './CovidService';
import UtilityService from './UtilityService';
import MessageService from './MessageService';
import './Countries.scss';

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
    CovidService.request(type, query)
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
      this.setState({countries: [], filteredCountries: []});
    })
  }

  handleChange(e) {
    const filteredCountries = this.state.countries.filter(function(item){
      return item.label.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredCountries: filteredCountries});
  }

  handleClick = (e) => {
    let iso = e.target.dataset.iso;
    this.sendMessage(iso);
  }

  sendMessage(country) {
    // send message to subscribers via observable subject
    MessageService.sendMessage(country);
    // MessageService.clearMessages();
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
              <ListGroup.Item 
                key={country.iso}
                data-iso={country.iso}
                className="list-item"
                onClick={this.handleClick}>
                {country.label}
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </React.Fragment>
    );
  }
}

class TotalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iso: this.props.iso ? this.props.iso : null,
      data: null
    };
    this.labels = {
      active: 'Active',
      confirmed: 'Confirmed',
      recovered: 'Recovered',
      deaths: 'Deaths',
      fatality_rate: 'Fatality Rate',
      global: 'Global'
    }
  }

  componentDidMount() {
    if(this.props.global){
      // get global data
      this.setTotals();
    } else {
      // if an iso is passed in, call to get the data
      if(this.props.iso){
        this.setTotals(this.props.iso);
      }

      // subscribe to messages
      this.subscription = MessageService.getMessage().subscribe(message => {
        if (message) {
          this.setState({ iso: message.message });
        } else {
          this.setState({ iso: null });
        }
        this.setTotals(message ? message.message : null);
      });
    }
  }

  setTotals(iso){
    const date = UtilityService.getYesterday();
    const type = iso ? 'reports' : 'reports/total';
    const query = iso ? {
      iso: iso
    } : {
      date: date
    }
    CovidService.request(type, query).then(response => {
      const data = response.data;
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

      this.setState({total: total});
    })
    .catch(err => {
      console.log(err);
      this.setState({total: null});
    })
  }

  componentWillUnmount() {
    if(this.subscription){
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
    }
  }

  render() {
    if(!this.state.total){
      return null;
    }

    return ( 
      <div className="totals">
        <h1>{this.props.global ? this.labels.global : this.state.total.name} Totals</h1>
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
    );
  }
}

class Totals extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TotalsTable global="true" />
        <TotalsTable />
      </React.Fragment>
    );
  }
}

class Countries extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container fluid>
          <Row>
            <Col md="2">
              <CountryList />
            </Col>
            <Col md="10">
              <Totals />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default Countries;