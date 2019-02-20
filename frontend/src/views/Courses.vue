<template lang="pug">
	.page.courses
		h1 Vakken
		div(v-for="(course, index) in courses" :key="course")
			h2 {{ course }}
			div(v-for="(lab, index) in assignments(course)" :key="lab.name")
				h3 {{ lab.name }}
				#progress
					#bar(v-bind:style="getBarStyle(lab)")
						p {{ getPercentage(lab) }}%
				p Je hebt {{ getWorkedHours(lab) }} uren gewerkt. De lector schat een gemiddelde van {{ lab.hourEstimate }} uren.
				h4 Milestones
				ul
					li(v-for="(milestone, index) in lab.milestones" :key="milestone.name" v-on:click="check(milestone)" :class="isChecked(milestone)") {{ milestone.name }}
</template>

<script>
export default {
	name: 'courses',
	data () {
		return {
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
			bar: { width: '1%' }
		};
	},
	computed: {
		courses: function () {
			let courseList = [];
			this.labs.forEach(lab => {
				courseList.push(lab.course.name);
			});
			return Array.from(new Set(courseList));
		}
	},
	methods: {
		assignments (course) {
			let assignmentList = [];
			this.labs.forEach(lab => {
				if (lab.course.name === course) {
					assignmentList.push(lab);
				}
			});
			return assignmentList;
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
		getBarStyle (lab) {
			let style = {};
			let percentage = this.getPercentage(lab);
			if (percentage > 100) {
				percentage = 100;
			}
			style.width = percentage + '%';
			return style;
		},
		isChecked (milestone) {
			if (milestone.isDone) {
				return 'checked';
			} else {
				return 'unchecked';
			};
		}
	}
};
</script>
<style lang="scss" scoped>
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
	#progress {
		width: 100%;
		background-color: grey;
	}

	#bar {
		height: 30px;
		background-color: green;
		color: white;
		text-align: right;
		font-weight: bold;
		vertical-align: center;
		line-height: 30px;
	}
	#bar p{
		padding-right: 1em;
		padding-left: 1em;
		display: inline;
	}
</style>
