import api from './api';

export default {
	post (workday) {
		return api().post('/workdays', workday);
	},
	put (workday) {
		return api().put(`/workdays/${workday._id}`, workday);
	},
	delete (workday) {
		return api().delete(`/workdays/${workday._id}`);
	},
	get () {
		return api().get('/workdays');
	},
	getId (id) {
		return api().get(`/workdays/${id}`);
	}
};
