<template lang="pug">
	.page.agenda
		h1 Agenda
		calendar-view.theme-default
</template>

<script>
import CalendarView from 'vue-simple-calendar';
require('../assets/css/default.css');
require('../assets/css/holidays.css');

export default {
	name: 'agenda',
	data: function () {
		return { showDate: new Date() };
	},
	components: {
		'calendar-view': CalendarView
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		}
	}
};
</script>
