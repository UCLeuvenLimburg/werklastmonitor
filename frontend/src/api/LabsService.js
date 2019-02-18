import api from './api';

export default {
	post (lab) {
		return api.post('/labs', lab);
	}
};
