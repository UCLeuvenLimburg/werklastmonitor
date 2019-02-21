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
		username: null
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
		setUsername (state, username) {
			state.username = username;
		},
		clearUsername (state) {
			state.username = null;
		}
	},
	actions: {
		updateDateRange (context, range) {
			context.commit('updateDateRange', range);
		},
		resetDateRange (context) {
			context.commit('resetDateRange');
		},
		setUsername (context, username) {
			context.commit('setUsername', username);
		},
		clearUsername (context) {
			context.commit('clearUsername');
		}
	},
	plugins: [vuexLocalStorace.plugin]
});
