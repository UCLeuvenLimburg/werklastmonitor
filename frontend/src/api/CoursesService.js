import api from './api';

export default {
	get (course) {
		if (course) {
			return api().get(`/courses/${course._id}`);
		} else {
			return api().get('/courses');
		}
	},
	post (course) {
		return api().post('/courses', course);
	},
	put (course) {
		return api().put(`/courses/${course._id}`, course);
	},
	delete (course) {
		return api().delete(`/courses/${course._id}`);
	}
};
