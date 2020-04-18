import Request from './Request';

const API_KEY =`${process.env.REACT_APP_COVID_19_API_KEY}`;

const covidRequest = (type, query) => {
	let url = 'https://covid-19-statistics.p.rapidapi.com';
	const host = "covid-19-statistics.p.rapidapi.com";
	const method = "GET";
	const headers = {
		"x-rapidapi-host": host,
		"x-rapidapi-key": API_KEY
	};
	
	url = type ? `${url}/${type}?` : url;
	for(let k in query){
		let endsWithQuestion = url.endsWith('?');
		if(endsWithQuestion){
			url += `${k}=${query[k]}`;
		} else {
			url += `&${k}=${query[k]}`;
		}
		
	}

	return Request(url, method, headers);
}

export default covidRequest;