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
					h3 Verhouding {{ getPercentage(getLab (selectedEvent.id)) }}%
					p {{ getWorkedHours(getLab (selectedEvent.id)) }} uren gewerkt. De docent schat een gemiddelde van {{ getLab(id).hourEstimate }} uren.
					h3 Milestones
					ul
						li(v-if='milestonable' v-for="(milestone, index) in getMilestones(selectedEvent.id)" :key="milestone.name + index" v-on:click="check(milestone)" :class="isChecked(milestone)")  {{ milestone.name }}
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
				startDate: new Date(2019, 1, 1),
				endDate: new Date(2019, 1, 12),
				hourEstimate: 50,
				course: { name: 'Computersystemen', fase: 1, courseCode: 'ABBA' },
				milestones: [{ id: 1, name: 'Eerste pagina', duration: 30, isDone: true }, { id: 2, name: 'Tweede pagina', duration: 30, isDone: false }]
			}, { id: 2,
				name: 'Leesopdracht',
				startDate: new Date(2019, 1, 10),
				endDate: new Date(2019, 1, 10),
				hourEstimate: 40,
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
				lab: { id: 1, name: 'Schrijven' },
				workdays: [{ day: new Date(2019, 1, 1), workhours: 5 }, { day: new Date(2019, 1, 2), workhours: 6 }]
			}, {
				id: 2,
				startDate: new Date(2019, 1, 9),
				endDate: new Date(2019, 1, 11),
				lab: { id: 1, name: 'Schrijven' },
				workdays: [{ day: new Date(2019, 1, 9), workhours: 5 }, { day: new Date(2019, 1, 10), workhours: 2 }, { day: new Date(2019, 1, 11), workhours: 5 }]
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
		isChecked (milestone) {
			if (milestone.isDone) {
				return 'checked';
			} else {
				return 'unchecked';
			};
		},
		check (m) {
			m.isDone = !m.isDone;
		},
		getPercentage (lab) {
			let estimatedHours = lab.hourEstimate;
			let workedHours = this.getWorkedHours(lab);
			let percentage = workedHours / estimatedHours;
			percentage *= 100;
			return percentage;
		},
		getWorkedHours (lab) {
			let workedHours = 0;
			this.worksessions.forEach(worksession => {
				if (worksession.lab.id === lab.id) {
					worksession.workdays.forEach(workday => {
						workedHours += workday.workhours;
					});
				}
			});
			return workedHours;
		},
		getLab (id) {
			let chosenLab;
			this.labs.forEach(lab => {
				if ('lab' + lab.id === this.selectedEvent.id) {
					chosenLab = lab;
				}
			});
			return chosenLab;
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
	ul li:nth-child(even) {
		background: #e9f3f8;
	}
	ul li:nth-child(even).checked {
		background: #888;
	}
	.checked::before {
		content: '';
		position: absolute;
		border-color: #fff;
		border-style: solid;
		border-width: 0 2px 2px 0;
		top: 10px;
		left: 16px;
		transform: rotate(45deg);
		height: 15px;
		width: 7px;
	}
	.checked {
		background: #888;
		color: #fff;
		text-decoration: line-through;
	}
	ul li {
		cursor: pointer;
		position: relative;
		padding: 12px 8px 12px 40px;
		list-style-type: none;
		transition: 0.2s;

		/* make the list items unselectable */
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	ul li:hover {
		background: #ddd;
	}
}
</style>
