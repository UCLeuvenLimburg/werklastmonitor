<template lang="pug">
	.page.agenda
		h1 Agenda
		calendar-view.calendar.theme-default(
			:show-date="showDate",
			:events="events",
			:startingDayOfWeek=1,
			@click-event="showEvent",
		@drop-on-date="dropDate",
		enableDragDrop=true,
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
				div(v-if='editable')
					a.button(:href="'/addsession?id='+ selectedEvent.id") Aanpassen
					a.button(v-on:click="deleteEvent") Verwijderen
		app-modal(ref="showWarningModal")
			span(slot="title") Waarschuwing
			div
				p Je kunt deadlines niet verplaatsen.
		app-modal(ref="showConfirmModal")
			span(slot="title") Bevestiging
			div
				p Wilt u de werksessie verplaatsen?
				a.button(v-on:click="confirmTrue") Ja
				a.button(v-on:click="confirmFalse") Nee
</template>

<script>
import AppModal from '@/components/AppModal';
import moment from 'moment';
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
			},
			editable: false,
			confirm: false,
			newStart: '',
			newDate: ''
		};
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		},
		showEvent (e) {
			if (!e.classes.includes('purple')) {
				this.editable = true;
			} else {
				this.editable = false;
			}
			this.selectedEvent = e;
			this.$refs.showEventModal.show();
			// this.editable = false;
		},
		dropDate (e, date) {
			if (!e.classes.includes('purple')) {
				let newDate = moment(date);
				var oldStart = moment(e.startDate); // todays date
				var oldEnd = moment(e.endDate); // another date
				let days = Math.abs(oldEnd.diff(oldStart, 'days'));
				this.newStart = moment(newDate).add(2, 'hours').format('YYYY-MM-DD');
				newDate.add(days, 'days');
				this.newEnd = moment(newDate).add(2, 'hours').format('YYYY-MM-DD');
				this.confirm = false;
				this.$refs.showConfirmModal.show();
			} else {
				// alert('Je kunt deadlines niet verplaatsen.');
				this.$refs.showWarningModal.show();
			}
		},
		confirmTrue () {
			this.events = [
				{
					id: '1',
					startDate: this.newStart,
					endDate: this.newEnd,
					title: 'Werkstukje'
				},
				{
					id: '2',
					startDate: '2019-02-08',
					title: 'Deadline schrijfopdracht (Computersystemen)',
					classes: 'purple'
				}
			];
			this.$refs.showConfirmModal.hide();
		},
		confirmFalse () {
			this.$refs.showConfirmModal.hide();
		},
		deleteEvent () {
			this.events = [
				{
					id: '2',
					startDate: '2019-02-08',
					title: 'Deadline schrijfopdracht (Computersystemen)',
					classes: 'purple'
				}
			];
			console.log(this.selectedEvent.title + ' is nu weg!');
			this.$refs.showEventModal.hide();
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
	a.button {
		appearance: button;
		text-decoration: none;
		color: white;
		background-color: #e00049;
		padding:5px;
		margin:2px;
		border-radius: 4px;
	}
}
</style>
