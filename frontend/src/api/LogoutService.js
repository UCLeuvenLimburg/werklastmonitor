import api from './api';

export default {
	get () {
		return api().get('/logout');
	}
};
