import api from './api';

export default {
	post (worksession) {
		return api.post('/worksessions', worksession);
	},
	put (worksession) {
		return api.put('/worksessions/' + worksession._id, worksession);
	},
	delete (worksession) {
		return api.delete('/worksessions/' + worksession._id);
	},
	get () {
		return api.get('/worksessions');
	},
	getId (id) {
		return api.get('/worksessions/' + id);
	}
};
