import api from './api';

export default {
	get (user) {
		if (user) {
			return api().get(`/users/${user}`);
		} else {
			return api().get('/users');
		}
	},
	post (user) {
		return api().post('/users', user);
	},
	put (id, user) {
		return api().put('/users/' + id, user);
	},
	delete (user) {
		return api().delete(`/users/${user._id}`);
	}
};
