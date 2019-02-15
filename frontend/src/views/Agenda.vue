<template lang="pug">
	.page.agenda
		h1 Agenda
		calendar-view.calendar.theme-default(
			:show-date="showDate",
			:events="events",
			:startingDayOfWeek=1,
			@click-event="showEvent"
			locale="nl")
			calendar-view-header(
				slot="header",
				slot-scope="t",
				:header-props="t.headerProps",
				@input="setShowDate")
</template>

<script>
import moment from 'moment';
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
require('../assets/css/default.css');

export default {
	name: 'agenda',
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
				},
				{
					id: '2',
					startDate: '2019-02-08',
					title: 'Deadline schrijfopdracht (Computersystemen)',
					classes: 'purple'
				}
			]
		};
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		},
		showEvent (e) {
			// Nodig als iets slecht leesbaar is
			// Op den duur wellicht vervangen met iets van vue
			moment.locale('nl');
			let details = e.title + '\n' + moment(e.startDate).format('D MMMM');
			if (moment(e.endDate).format() !== moment(e.startDate).format()) {
				alert(details + ' – ' + moment(e.endDate).format('D MMMM'));
			} else {
				alert(details);
			}
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
