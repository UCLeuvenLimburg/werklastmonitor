<template lang="pug">
	.page.courses
		h1 Vakken
		div(v-for="(course, index) in courses" :key="course")
			h2.course-name {{ course }}
			div.labs(v-for="(lab, index) in assignments(course)" :key="lab._id")
				h3.lab-name {{ lab.name }}
				#progress
					#bar(v-bind:style="getBarStyle(lab)")
						p {{ getPercentage(lab) }}%
				p Je hebt {{ getWorkedHours(lab) }} uren gewerkt. De lector schat een gemiddelde van {{ lab.hourEstimate }} uren.
				h4.milestones Milestones
				ul
					li(v-for="(milestone, index) in lab.milestones" :key="milestone._id" v-on:click="check(milestone)" :class="isChecked(milestone)") {{ milestone.name }}
</template>

<script>
import LabsService from '@/api/LabsService';
import WorksessionService from '@/api/WorksessionService';
import UserService from '../api/UsersService.js';
export default {
	name: 'courses',
	data () {
		return {
			userCourses: [],
			userMilestones: [],
			labs: [],
			worksessions: [],
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
		},
		username () {
			return this.$store.state.username;
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
			UserService.get(this.username)
				.then((result) => {
					let user = result.data;
					let index = user.milestones.indexOf(m._id);
					if (index === -1) {
						user.milestones.push(m._id);
					} else {
						user.milestones.splice(index, 1);
					}
					UserService.put(user._id, user)
						.then((res) => {
							this.userMilestones = user.milestones;
							this.isChecked(m);
						});
				})
				.catch((err) => {
					console.log(err);
				});
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
			for (let i = 0; i < this.userMilestones.length; ++i) {
				if (this.userMilestones[i] === milestone._id) {
					return 'checked';
				}
			}
			return 'unchecked';
		}
	},
	created () {
		(async () => {
			UserService.get(this.username)
				.then((result) => {
					let user = result.data;
					this.userCourses = user.courses;
					this.userMilestones = user.milestones;
				});
			this.events = [];
			this.labs = [];
			let labs = await LabsService.get();
			let unfilteredLabs = labs.data;
			unfilteredLabs.forEach(lab => {
				if (this.userCourses.includes(lab.course._id)) {
					this.labs.push(lab);
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
		})();
	}
};
</script>
<style lang="scss" scoped>
@import '../assets/css/definitions';

	ul li:nth-child(even) {
		background: #e9f3f8;
	}
	ul li:nth-child(even).checked {
		background: #888;
	}
	.labs {
		margin-bottom: 40px;
		.lab-name {
			margin-top: 20px;
		}
		.milestones {
			margin-top: 20px;
		}
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
