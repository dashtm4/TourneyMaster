import axios from 'axios';

const API_BASE_URL = 'https://api.tourneymaster.org/public/';

const instance = axios.create({
	baseURL: API_BASE_URL
});

instance.defaults.headers.common['Content-Type'] = 'application/json';

instance.interceptors.request.use(null, error => {
	console.error('Request Error: ', error);
	return Promise.reject(error);
});

instance.interceptors.response.use(
	response => {
		console.log(
			`Status: ${response.status} (${response.statusText}). URL: ${response.config.url}`
		);
		return response;
	},
	error => {
		console.log(
			`Error: ${error.response.status} (${error.response.statusText})`
		);
		console.log('URL: ', error.config.url);
		console.log('Payload: ', error.config.data);
		return Promise.reject(error);
	}
);

export default instance;
