import axios from 'axios';
import config from '../config';

export default () => {
	axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
	return axios.create({
		baseURL: config.backend.baseURL
	});
};
