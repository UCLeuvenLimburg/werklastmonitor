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

		app-modal(ref="showEventModal")
			span(slot="title") {{ selectedEvent.title }}
			div
				p #[span.section-title Van:] {{ selectedEvent.startDate | dateFormatDayMonth }}
				p #[span.section-title Tot:] {{ selectedEvent.endDate | dateFormatDayMonth }}
</template>

<script>
import AppModal from '@/components/AppModal';
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
require('../assets/css/default.css');

export default {
	name: 'agenda',
	components: {
		CalendarView,
		CalendarViewHeader,
		AppModal
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
			],
			selectedEvent: {
				id: null,
				startDate: null,
				endDate: null,
				title: null
			}
		};
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		},
		showEvent (e) {
			this.selectedEvent = e;
			this.$refs.showEventModal.show();
		}
	}
};
</script>

<style lang="scss" scoped>
.agenda {
	.calendar {
		height: 620px;
		margin-left: auto;
		margin-right: auto;
	}

	span.section-title {
		display: inline-block;
		width: 3rem;
		font-weight: bold;
	}
}
</style>
