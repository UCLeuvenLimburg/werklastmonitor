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
				div(v-if='milestonable')
					h3 Milestones
					ul
					li(v-if='milestonable' v-for="(milestone, index) in getMilestones(selectedEvent.id)" :key="milestone.name + index")
						p.unchecked(v-on:click="check(milestone, true)", v-if="!milestone.isDone") {{ milestone.name }}
						p.checked(v-on:click="check(milestone, false)", v-if="milestone.isDone") {{ milestone.name }}
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
			labs: [{
				id: 1,
				name: 'Schrijfopdracht',
				startDate: new Date(2019, 1, 2),
				endDate: new Date(2019, 1, 3),
				hourEstimate: 50,
				course: { name: 'Computersystemen', fase: 1, courseCode: 'ABBA' },
				milestones: [{ id: 1, name: 'Eerste pagina', duration: 30, isDone: true }, { id: 2, name: 'Tweede pagina', duration: 30, isDone: false }]
			}, { id: 2,
				name: 'Leesopdracht',
				startDate: new Date(2019, 1, 10),
				endDate: new Date(2019, 1, 10),
				hourEstimate: 50,
				course: { name: 'Computersystemen', fase: 1, courseCode: 'ABBA' },
				milestones: [{ id: 1, name: 'Gelezen', duration: 30, isDone: false }]
			}, { id: 3,
				name: 'Rudymoppen verzinnen',
				startDate: new Date(2019, 1, 3),
				endDate: new Date(2019, 1, 7),
				hourEstimate: 50,
				course: { name: 'Netwerken', fase: 1, courseCode: 'RUDY' },
				milestones: [{ id: 1, name: 'Flauwe mop googlen', duration: 30, isDone: false }]
			}],
			worksessions: [{
				id: 1,
				startDate: new Date(2019, 1, 1),
				endDate: new Date(2019, 1, 2),
				lab: { name: 'Werkstukje' }
			}, {
				id: 2,
				startDate: new Date(2019, 1, 10),
				endDate: new Date(2019, 1, 12),
				lab: { name: 'Programmeren' }
			}],
			events: [],
			selectedEvent: {
				id: 0,
				startDate: null,
				endDate: null,
				title: null
			},
			editable: false,
			milestonable: false,
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
			this.milestonable = false;
			if (!e.classes.includes('purple')) {
				this.editable = true;
			} else {
				this.editable = false;
				this.milestonable = true;
			}
			this.selectedEvent = e;
			this.$refs.showEventModal.show();
			// this.editable = false;
		},
		dropDate (e, date) {
			this.selectedEvent = e;
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
			for (var i = 0; i < this.worksessions.length; i++) {
				if (this.worksessions[i].id === this.selectedEvent.id) {
					this.worksessions[i].startDate = this.newStart;
					this.worksessions[i].endDate = this.newEnd;
				}
			}
			this.redraw();
			this.$refs.showConfirmModal.hide();
		},
		confirmFalse () {
			this.$refs.showConfirmModal.hide();
		},
		deleteEvent () {
			console.log(this.selectedEvent.id);
			console.log(this.worksessions);
			for (var b = 0; b < this.worksessions.length; b++) {
				console.log(this.worksessions[b].id);
				if (this.worksessions[b].id === this.selectedEvent.id) {
					this.worksessions.splice(b, 1);
				}
			}
			console.log(this.worksessions);
			this.redraw();
			console.log(this.selectedEvent.title + ' is nu weg!');
			this.$refs.showEventModal.hide();
		},
		getMilestones (l) {
			let milestones = [];
			if (this.$refs.showEventModal) {
				this.labs.forEach(lab => {
					if ('lab' + lab.id === this.selectedEvent.id) {
						milestones = lab.milestones;
					}
				});
			}
			return milestones;
		},
		redraw () {
			this.events = [];
			this.labs.forEach(lab => {
				let event = {};
				event.id = lab.name + '/' + lab.course.courseCode;
				event.startDate = moment(lab.endDate).format('YYYY-MM-DD');
				event.title = 'Deadline ' + lab.name + ' (' + lab.course.name + ')';
				event.classes = 'purple';
				this.events.push(event);
			});
			this.worksessions.forEach(worksession => {
				let event = {};
				event.id = worksession.id;
				event.startDate = moment(worksession.startDate).format('YYYY-MM-DD');
				event.endDate = moment(worksession.endDate).format('YYYY-MM-DD');
				event.title = worksession.lab.name;
				this.events.push(event);
			});
		},
		check (m, b) {
			this.labs.forEach(lab => {
				if ('lab' + lab.id === this.selectedEvent.id) {
					lab.milestones.forEach(milestone => {
						if (milestone.id === m.id) {
							milestone.isDone = b;
						}
					});
				}
			});
		}
	},
	mounted () {
		this.labs.forEach(lab => {
			let event = {};
			event.id = 'lab' + lab.id;
			event.startDate = moment(lab.endDate).format('YYYY-MM-DD');
			event.title = 'Deadline ' + lab.name + ' (' + lab.course.name + ')';
			event.classes = 'purple';
			this.events.push(event);
		});
		this.worksessions.forEach(worksession => {
			let event = {};
			event.id = worksession.id;
			event.startDate = moment(worksession.startDate).format('YYYY-MM-DD');
			event.endDate = moment(worksession.endDate).format('YYYY-MM-DD');
			event.title = worksession.lab.name;
			this.events.push(event);
		});
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
		cursor: pointer;
		appearance: button;
		text-decoration: none;
		color: white;
		background-color: #e00049;
		padding:5px;
		border-radius: 4px;
		font-size: 120%;
		display: inline-block;
		margin: 15px 5px 5px;
	}
	a.button:hover {
		background-color: #003469;
	}
	.checked {
		text-decoration: line-through;
	}
	li {
		margin-left: 1rem;
		cursor: pointer;
	}
}
</style>
