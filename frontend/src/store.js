import Vue from 'vue';
import Vuex from 'vuex';

import moment from 'moment';
moment.locale('nl');

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		dateRange: {
			type: 1,
			startDate: moment().startOf('week'),
			endDate: moment().add(1, 'week').endOf('week')
		}
	},
	mutations: {
		updateDateRange (state, range) {
			state.dateRange = range;
		},
		resetDateRange (state) {
			state.dateRange = {
				type: 1,
				startDate: moment().startOf('week'),
				endDate: moment().add(1, 'week').endOf('week')
			};
		}
	},
	actions: {
		updateDateRange (context, range) {
			context.commit('updateDateRange', range);
		},
		resetDateRange (context) {
			context.commit('resetDateRange');
		}
	}
});
