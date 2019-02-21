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
			locale="nl",
			:key="cal")
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
					router-link.button(:to="'/addsession?id='+ selectedEvent.id") Aanpassen
					a.button(v-on:click="deleteEvent") Verwijderen
				div(v-if='milestonable')
					h3(v-if='milestonable') Verhouding {{ getPercentage(getLab (selectedEvent.id)) }}%
					p(v-if='milestonable') {{ getWorkedHours(getLab (selectedEvent.id)) }} uren gewerkt. Verwacht gemiddelde: {{ getLab(selectedEvent.id).hourEstimate }} uren.
					h3 Milestones
					ul
						li(v-if='milestonable' v-for="(milestone, index) in getMilestones(selectedEvent.id)" :key="milestone._id" v-on:click="check(milestone)" :class="isChecked(milestone)")  {{ milestone.name }}
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
import LabsService from '@/api/LabsService';
import WorksessionService from '@/api/WorksessionService';
import UserService from '../api/UsersService.js';

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
			labs: [],
			worksessions: [],
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
			newDate: '',
			cal: 0,
			userCourses: []
		};
	},
	computed: {
		username () {
			return this.$store.state.username;
		}
	},
	methods: {
		setShowDate (d) {
			this.showDate = d;
		},
		showEvent (e) {
			this.selectedEvent = e;
			this.milestonable = false;
			this.editable = false;
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
				this.$refs.showWarningModal.show();
			}
		},
		confirmTrue () {
			(async () => {
				let worksession;
				let oldStart;
				for (var i = 0; i < this.worksessions.length; i++) {
					if (this.worksessions[i]._id === this.selectedEvent.id) {
						worksession = this.worksessions[i];
						oldStart = worksession.startDate;
						worksession.startDate = this.newStart;
						worksession.endDate = this.newEnd;
					}
				}
				let days = moment(worksession.startDate).diff(moment(oldStart), 'days');
				worksession.workdays.forEach(workday => {
					workday.day = moment(workday.day).add(days, 'days').toDate();
				});
				// await WorksessionService.put(worksession).then(this.showAll());
				this.$refs.showConfirmModal.hide();
			})();
		},
		confirmFalse () {
			this.$refs.showConfirmModal.hide();
		},
		deleteEvent () {
			(async () => {
				let deletedEvent;
				for (var b = 0; b < this.worksessions.length; b++) {
					if (this.worksessions[b]._id === this.selectedEvent.id) {
						deletedEvent = this.worksessions[b];
					}
				}
				await WorksessionService.delete(deletedEvent);
				this.$refs.showConfirmModal.hide();
				this.showAll();
				this.$refs.showEventModal.hide();
			})();
		},
		getMilestones (l) {
			let milestones = [];
			if (this.$refs.showEventModal) {
				this.labs.forEach(lab => {
					if (lab._id === this.selectedEvent.id) {
						milestones = lab.milestones;
					}
				});
			}
			return milestones;
		},
		redraw () {
			this.cal += 1;
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
			return Math.round(percentage);
		},
		getWorkedHours (lab) {
			let workedHours = 0;
			this.worksessions.forEach(worksession => {
				if (worksession.lab === lab._id) {
					worksession.workdays.forEach(workday => {
						workedHours += workday.workhours;
					});
				}
			});
			return workedHours;
		},
		getLab (id) {
			let chosenLab = [{
				_id: 0,
				name: '',
				startDate: new Date(),
				endDate: new Date(),
				hourEstimate: 0,
				course: { name: '', fase: 0, courseCode: '' },
				milestones: [{ _id: 0, name: '', duration: 0, isDone: false }]
			}];
			this.labs.forEach(lab => {
				if (lab._id === id) {
					chosenLab = lab;
				}
			});
			return chosenLab;
		},
		showAll () {
			(async () => {
				UserService.get(this.username)
					.then((result) => {
						let user = result.data;
						this.userCourses = user.courses;
					});
				this.events = [];
				let labs = await LabsService.get();
				this.labs = labs.data;
				this.labs.forEach(lab => {
					if (this.userCourses.includes(lab.course._id)) {
						let event = {};
						event.id = lab._id;
						event.startDate = moment(lab.endDate).format('YYYY-MM-DD');
						event.title = 'Deadline ' + lab.name + ' (' + lab.course.name + ')';
						event.classes = 'purple';
						this.events.push(event);
					}
				});
				let worksessions = await WorksessionService.get();
				let unfilteredWorksessions = worksessions.data;
				this.worksessions = [];
				unfilteredWorksessions.forEach(worksession => {
					if (worksession.studentNumber === this.username) {
						this.worksessions.push(worksession);
					}
				});
				this.worksessions.forEach(worksession => {
					let event = {};
					event.id = worksession._id;
					event.startDate = moment(worksession.startDate).format('YYYY-MM-DD');
					event.endDate = moment(worksession.endDate).format('YYYY-MM-DD');
					event.title = this.getLab(worksession.lab).name;
					this.events.push(event);
				});
			})();
		}
	},
	mounted () {
		this.showAll();
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
