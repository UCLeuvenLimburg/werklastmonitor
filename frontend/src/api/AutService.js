import api from './api';

export default {
	get () {
		return api().get('/aut');
	},
	post (code) {
		return api().post('/aut', code);
	}
};
