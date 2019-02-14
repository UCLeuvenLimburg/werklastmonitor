import api from './api';

export default {
	post (username, password) {
		return api.post('/login', {
			username,
			password
		});
	}
};
