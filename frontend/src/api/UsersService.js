import api from './api';

export default {
	get (user) {
		if (user) {
			return api.get(`/users/${user._id}`);
		} else {
			return api.get('/users');
		}
	},
	post (user) {
		return api.post('/users', user);
	},
	put (user) {
		return api.put('/user' + user._id);
	}
}
