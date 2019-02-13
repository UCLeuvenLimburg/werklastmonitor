import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import XLSX from 'xlsx';
import VueGraph from 'vue-graph';

Vue.config.productionTip = false;
Vue.use(XLSX);
Vue.use(VueGraph);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
