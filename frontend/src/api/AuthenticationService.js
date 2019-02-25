import api from './api';

export default {
	get () {
		return api().get('/auth');
	},
	post (username) {
		return api().post('/auth', {
			username
		});
	}
	/*
	post (username, password) {
		return api().post('/auth', {
			username,
			password
		});
	}
	*/
};
