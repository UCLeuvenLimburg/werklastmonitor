import api from './api';

export default {
	get (filename) {
		return api().get(`/static/${filename}`, {
			responseType: 'blob'
		});
	}
};
