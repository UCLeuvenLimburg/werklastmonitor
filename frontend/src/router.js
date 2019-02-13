import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Agenda from './views/Agenda.vue';
import Upload from './views/Upload.vue';
import Workload from './views/Workload.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/Agenda',
			name: 'agenda',
			component: Agenda
		},
		{
			path: '/upload',
			name: 'upload',
			component: Upload
		},
		{
			path: '/workload',
			name: 'workload',
			component: Workload
		}
		// ,
		// {
		// path: '/about',
		// name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		// }
	]
});
