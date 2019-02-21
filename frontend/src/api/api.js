import axios from 'axios';
import config from '../config';

export default () => {
	return axios.create({
		baseURL: config.backend.baseURL,
		headers: {
			'Authorization': `Token ${localStorage.getItem('jwtToken')}`
		},
		data: {
			user: localStorage.vuex.user
		}
	});
};
