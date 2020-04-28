export default function request(url, method, headers) {
	const additional = {
		method: method ? method : 'GET'
	}

	if(headers){
		additional.headers = headers;
	}

	return fetch(url, additional);
}