import axios from 'axios';
import config from '../config';

export default () => {
	let token = localStorage.getItem('jwtToken');
	return axios.create({
		baseURL: config.backend.baseURL,
		headers: {
			'Authorization': token ? `Token ${token}` : null
		}
	});
};
