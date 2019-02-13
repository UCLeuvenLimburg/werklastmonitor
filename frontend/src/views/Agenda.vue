<template lang="pug">
	.page.agenda
		h1 Agenda
		calendar-view.calendar.theme-default(
			:show-date="showDate",
			:events="events")
			calendar-view-header(
				slot="header",
				slot-scope="t",
				:header-props="t.headerProps",
				@input="setShowDate")
</template>

<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/static/css/default.css');
// require('vue-simple-calendar/static/css/holidays-us.css');

export default {
	name: 'app',
	components: {
		CalendarView,
		CalendarViewHeader
	},
	data () {
		return {
			showDate: new Date(),
			events: [
				{
					id: '1',
					startDate: '2019-02-01',
					endDate: '2019-02-02',
					title: 'Werkstukje'
				}
			]
		};
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		}
	}
};
</script>

<style lang="scss" scoped>
.calendar {
	height: 620px;
	margin-left: auto;
	margin-right: auto;
}
</style>
