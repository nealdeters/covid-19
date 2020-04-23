import Request from './Request';

let API_KEY;
if(process.env.NODE_ENV !== 'production'){
	API_KEY = `${process.env.REACT_APP_COVID_19_API_KEY}`;
} else {
	API_KEY = `${process.env.COVID_19_API_KEY}`;
}

const CovidService = {
	request: (type, query) => {
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

		return Request(url, method, headers).then(response => {
			return response.json();
		});
	}
}

export default CovidService;