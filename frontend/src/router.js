import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

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
			path: '/agenda',
			name: 'agenda',
			component: () => import(/* webpackChunkName: "agenda" */ './views/Agenda.vue')
		},
		{
			path: '/upload',
			name: 'upload',
			component: () => import(/* webpackChunkName: "upload" */ './views/Upload.vue')
		},
		{
			path: '/workload',
			name: 'workload',
			component: () => import(/* webpackChunkName: "workload" */ './views/Workload.vue')
		},
		{
			path: '/addsession',
			name: 'addsession',
			component: () => import(/* webpackChunkName: "workload" */ './views/AddSession.vue')
		},
		{
			path: '/courses',
			name: 'courses',
			component: () => import(/* webpackChunkName: "workload" */ './views/Courses.vue')
		},
		{
			path: '/registration',
			name: 'registration',
			component: () => import('./views/Registration.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: () => import(/* webpackChunkName: "login" */ './views/Login')
		}
	]
});
