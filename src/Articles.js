import React from 'react';
import covidRequest from './covidRequest';

export default class Articles extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: []
		}
	}

	componentDidMount() {
		// get yestedays date in iso format
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const date = yesterday.toISOString().slice(0,10);

		// define type and query params
		const type = "reports";
		const query = {
			// region_province: "Illinois",
			iso: "USA",
			date: date
		}

		// request from covid api
		covidRequest(type, query)
		.then(response => {
			return response.json();
		})
		.then(response => {
			this.setState({articles: response.data});
		})
		.catch(err => {
			console.log(err);
		});
	}

	render() {
		return (
			<div>foo</div>
		);
	}
}

