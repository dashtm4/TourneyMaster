import axios from './axios.js';

export const getActiveProducts = async () => {
	return axios.get('/products').then(data => {
		return data.data;
	});
};

export const getActiveSkus = async () => {
	return axios.get('/skus').then(data => {
		return data.data;
	});
};
