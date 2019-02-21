import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import moment from 'moment';
moment.locale('nl');

Vue.use(Vuex);
const vuexLocalStorace = new VuexPersist({
	key: 'vuex',
	storage: window.localStorage
});

export default new Vuex.Store({
	state: {
		dateRange: {
			type: 1,
			startDate: moment().startOf('week'),
			endDate: moment().add(1, 'week').endOf('week')
		},
		user: null
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
		},
		setUser (state, user) {
			state.user = user;
		},
		clearUser (state) {
			state.user = null;
		}
	},
	actions: {
		updateDateRange (context, range) {
			context.commit('updateDateRange', range);
		},
		resetDateRange (context) {
			context.commit('resetDateRange');
		},
		setUser (context, user) {
			context.commit('setUser', user);
		},
		clearUser (context) {
			context.commit('clearUser');
		}
	},
	plugins: [vuexLocalStorace.plugin]
});
