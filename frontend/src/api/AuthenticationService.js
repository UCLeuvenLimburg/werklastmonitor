import api from './api';

export default {
	get () {
		return api().get('/auth');
	},
	post (username, password) {
		return api().post('/auth', {
			username,
			password
		});
	}
};
