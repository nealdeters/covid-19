export default function request(url, method, headers) {
	return fetch(url, {method: method, headers: headers});
}