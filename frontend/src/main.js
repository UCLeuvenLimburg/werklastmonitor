import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import XLSX from 'xlsx';
import VueGraph from 'vue-graph';
import moment from 'moment';

Vue.config.productionTip = false;
Vue.use(XLSX);
Vue.use(VueGraph);

moment.locale('nl');

Vue.filter('dateFormatDayMonth', (value) => {
	if (value) {
		return moment(value).format('D MMMM');
	}
});

Vue.filter('dateFormatMonthFull', (value) => {
	if (value) {
		let str = value.format('MMMM');
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
