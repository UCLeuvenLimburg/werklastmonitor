<template>
	<div id="app">
		<h1>Agenda</h1>
		<calendar-view
			:show-date="showDate"
			:events="events"
			class="theme-default">
			<calendar-view-header
				slot="header"
				slot-scope="t"
				:header-props="t.headerProps"
				@input="setShowDate" />
		</calendar-view>
	</div>
</template>
<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
require('../assets/css/default.css');
// require('vue-simple-calendar/static/css/holidays-us.css');

export default {
	name: 'app',
	data: function () {
		return {
			showDate: new Date(),
			events: [{ id: '1', startDate: '2019-02-01', endDate: '2019-02-02', title: 'Werkstukje' }]
		};
	},
	components: {
		CalendarView,
		CalendarViewHeader
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		}
	}
};
</script>
<style>
	#app {
		height: 67vh;
		margin-left: auto;
		margin-right: auto;
	}
</style>
