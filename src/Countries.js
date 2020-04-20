import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import covid from './covid';
import UtilityService from './UtilityService';
import MessageService from './MessageService';
import './Countries.scss';

// on select of country will show new component below yesterday
// on enter with only one result, select the option
// create countryTotals component

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

class CountryTotals extends React.Component {
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
      fatality_rate: 'Fatality Rate'
    }

    // if an iso is passed in, call to get the data
    if(this.props.iso){
      this.setCountry(this.props.iso);
    }
  }

  componentDidMount() {
    // subscribe to home component messages
    this.subscription = MessageService.getMessage().subscribe(message => {
      if (message) {
        // add message to local state if not empty
        this.setState({ iso: message.message });
      } else {
        // clear messages when empty message received
        this.setState({ iso: null });
      }
      this.setCountry(message ? message.message : null);
    });
  }

  setCountry(iso){
    const date = UtilityService.getYesterday();
    const type = 'reports';
    const query = {
      date: date,
      iso: iso
    }
    covid.request(type, query).then(response => {
      const data = response.data;
      let total = {
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

      total.active = UtilityService.addCommas(total.active);
      total.confirmed = UtilityService.addCommas(total.confirmed);
      total.recovered = UtilityService.addCommas(total.recovered);
      total.deaths = UtilityService.addCommas(total.deaths);
      total.active_diff = UtilityService.addCommas(total.active_diff > 0 ? total.active_diff : 0);
      total.confirmed_diff = UtilityService.addCommas(total.confirmed_diff > 0 ? total.confirmed_diff : 0);
      total.recovered_diff = UtilityService.addCommas(total.recovered_diff > 0 ? total.recovered_diff : 0);
      total.deaths_diff = UtilityService.addCommas(total.deaths_diff > 0 ? total.deaths_diff : 0);
      total.fatality_rate = UtilityService.toPercentage(total.fatality_rate / data.length);

      this.setState({data: total});
    })
    .catch(err => {
      console.log(err);
      this.setState({data: null});
    })

    // covid.request('reports', {iso: iso}).then(response => {
    //   console.log(response.data)
    // })
    // .catch(err => {
    //   console.log(err);
    // })
  }

  componentWillUnmount() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  render() {
    if(!this.state.data){
      return null;
    }

    return ( 
      <div className="country">
        <h1>{this.state.data.name} Totals</h1>
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
                  <td>{this.state.data.active_diff}</td>
                  <td>{this.state.data.confirmed_diff}</td>
                  <td>{this.state.data.recovered_diff}</td>
                  <td>{this.state.data.deaths_diff}</td>
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
                  <td>{this.state.data.active}</td>
                  <td>{this.state.data.confirmed}</td>
                  <td>{this.state.data.recovered}</td>
                  <td>{this.state.data.deaths}</td>
                  <td>{this.state.data.fatality_rate}</td>
                </tr>
              </tbody>
            </Table>
          </div>
      </div>
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
            data[key] = UtilityService.addCommas(data[key] > 0 ? data[key] : 0);
          }
        }        
      }
      this.setState({total: data});
    })
    .catch(err => {
      console.log(err);
      this.setState({total: 0})
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="global">
          <h1>Global Totals</h1>

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

class Totals extends React.Component {
  render() {
    return (
      <>
        <GlobalTotals />
        <CountryTotals />
      </>
    );
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
              <Totals />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default Countries;