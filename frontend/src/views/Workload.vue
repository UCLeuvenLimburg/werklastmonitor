<template lang="pug">
	.page.workload
		h1(v-if="!toggle") Algemene Werklast
		h1(v-if="toggle") Persoonlijke Werklast
		button(@click="showDateRangePicker")
			mdi-calendar-icon
			p Kies periode
		app-date-range-picker(ref="dateRangePicker")
		graph-stackbar(
			:height="400",
			:labels="filteredCourses.tags",
			:full-mode="false",
			:show-text="true",
			:names="filteredCourses.names",
			:values="filteredCourses.hours",
			:colors="colors",
			:key="graph")
			legends(:names="filteredCourses.names", :filter="true")
			tooltip(:names="filteredCourses.names", position="right")
		.toggler(v-if='isStudent')
			label.switch(@change="toggleChange")
				input(type='checkbox')
				span.slider
			p Algemene/Persoonlijke werklast
</template>

<script>
import 'mdi-vue/CalendarIcon';
import AppDateRangePicker from '@/components/AppDateRangePicker';
import UserService from '../api/UsersService.js';
import WorksessionService from '@/api/WorksessionService';
import LabsService from '@/api/LabsService';
import moment from 'moment';

export default {
	name: 'workload',
	components: {
		AppDateRangePicker
	},
	data () {
		return {
			labs: [],
			worksessions: [],
			toggle: false,
			graph: 0,
			values: [
				[ 10, 5, 5, 5 ],
				[ 40, 10, 10, 10 ],
				[ 30, 30, 30, 30 ]
			],
			userCourses: [],
			calculatedCourses: []
		};
	},
	methods: {
		toggleChange () {
			this.toggle = !this.toggle;
		},
		getCourseById (id) {
			let lab = this.labs.find(item => item._id === id);
			return lab.course;
		},
		compareWorkdays (a, b) {
			if (a.day < b.day) {
				return -1;
			}
			if (a.day > b.day) {
				return 1;
			}
			return 0;
		},
		calcCourses () {
			let courses = [];
			this.userCourses.forEach(course => {
				let temp = {};
				temp.id = course;
				temp.workdays = [];
				temp.name = '';
				courses.push(temp);
			});
			this.worksessions.forEach(worksession => {
				if (worksession.studentNumber === this.username) {
					courses.find(item => item.id === this.getCourseById(worksession.lab)._id).name = this.getCourseById(worksession.lab).name;
					worksession.workdays.forEach(workday => {
						courses.find(item => item.id === this.getCourseById(worksession.lab)._id).workdays.push(workday);
					});
				}
			});
			courses.forEach(course => {
				course.workdays.sort(this.compareWorkdays);
			});
			this.calculatedCourses = [];
			courses.forEach(course => {
				if (course.name !== '') {
					this.calculatedCourses.push(course);
				}
			});
		},
		getPersonalCoursesForPeriod (type, start, end) {
			let self = this;
			let courses = {
				names: [],
				codes: [], // Purely here for ease of development
				hours: [],
				tags: []
			};
			let time = moment(start);

			switch (type) {
			case 0:
				while (time.isBefore(end)) {
					courses.tags.push(time.format('MMMM, YYYY'));
					time.add(1, 'month');
				}
				break;

			case 1:
				while (time.isBefore(end)) {
					courses.tags.push(`${time.format('DD/MM')} - ${moment(time).add(6, 'days').format('DD/MM')}`);
					time.add(1, 'week');
				}
				break;

			case 2:
				while (time.isSameOrBefore(end)) {
					courses.tags.push(time.format('DD/MM'));
					time.add(1, 'day');
				}
				break;
			}

			self.calculatedCourses.forEach((course) => {
				let labHours = [];

				let hours = 0;

				let day = moment(start).add(2, 'hours');
				while (day.isSameOrBefore(end)) {
					switch (type) {
					case 0:
						if (day.isSameOrAfter(start) && day.isSameOrBefore(end)) {
							let hoursPerDay = 0;
							course.workdays.forEach((workday) => {
								if (moment(workday.day).isSame(day, 'day')) {
									hoursPerDay += workday.workhours;
								}
							});
							hours += hoursPerDay;
						}
						if (day.date() === day.daysInMonth()) {
							labHours.push(hours);
							hours = 0;
						}
						break;

					case 1:
						if (day.isSameOrAfter(start) && day.isSameOrBefore(end)) {
							let hoursPerDay = 0;
							course.workdays.forEach((workday) => {
								if (moment(workday.day).isSame(day, 'day')) {
									hoursPerDay += workday.workhours;
								}
							});
							hours += hoursPerDay;
						}
						if (day.isoWeekday() === 7) {
							labHours.push(hours);
							hours = 0;
						}
						break;

					case 2:
						if (day.isSameOrAfter(start) && day.isSameOrBefore(end)) {
							let hoursPerDay = 0;
							course.workdays.forEach((workday) => {
								if (moment(workday.day).isSame(day, 'day')) {
									hoursPerDay += workday.workhours;
								}
							});
							labHours.push(hoursPerDay);
						} else {
							labHours.push(0);
						}
						break;
					}
					day.add(1, 'day');
				}

				let index = courses.codes.indexOf(course.id);
				if (index < 0) {
					courses.names.push(course.name);
					courses.codes.push(course.id);
					courses.hours.push(labHours);
				} else {
					for (let i = 0; i < labHours.length; ++i) {
						courses.hours[index][i] += labHours[i];
					}
				}
			});
			return courses;
		},
		showDateRangePicker () {
			this.$refs.dateRangePicker.show();
		},
		getCoursesForPeriod (type, start, end) {
			if (this.toggle) {
				return this.getPersonalCoursesForPeriod(type, start, end);
			} else {
				return this.getGeneralCoursesForPeriod(type, start, end);
			}
		},
		getGeneralCoursesForPeriod (type, start, end) {
			let self = this;
			let courses = {
				names: [],
				codes: [], // Purely here for ease of development
				hours: [],
				tags: []
			};
			let time = moment(start);

			switch (type) {
			case 0:
				while (time.isBefore(end)) {
					courses.tags.push(time.format('MMMM, YYYY'));
					time.add(1, 'month');
				}
				break;

			case 1:
				while (time.isBefore(end)) {
					courses.tags.push(`${time.format('DD/MM')} - ${moment(time).add(6, 'days').format('DD/MM')}`);
					time.add(1, 'week');
				}
				break;

			case 2:
				while (time.isSameOrBefore(end)) {
					courses.tags.push(time.format('DD/MM'));
					time.add(1, 'day');
				}
				break;
			}

			self.labs.forEach((lab) => {
				let labStartDate = moment(lab.startDate);
				let labEndDate = moment(lab.endDate);
				let labHours = [];

				let days = labEndDate.diff(labStartDate, 'days');
				let hoursPerDay = lab.hourEstimate / days;
				let hours = 0;

				let day = moment(start);
				while (day.isSameOrBefore(end)) {
					switch (type) {
					case 0:
						if (day.isSameOrAfter(labStartDate) && day.isSameOrBefore(labEndDate)) {
							hours += hoursPerDay;
						}
						if (day.date() === day.daysInMonth()) {
							labHours.push(hours);
							hours = 0;
						}
						break;

					case 1:
						if (day.isSameOrAfter(labStartDate) && day.isSameOrBefore(labEndDate)) {
							hours += hoursPerDay;
						}
						if (day.isoWeekday() === 7) {
							labHours.push(hours);
							hours = 0;
						}
						break;

					case 2:
						if (day.isSameOrAfter(labStartDate) && day.isSameOrBefore(labEndDate)) {
							labHours.push(hoursPerDay);
						} else {
							labHours.push(0);
						}
						break;
					}
					day.add(1, 'day');
				}

				let index = courses.codes.indexOf(lab.course.courseCode);
				if (index < 0) {
					courses.names.push(lab.course.name);
					courses.codes.push(lab.course.courseCode);
					courses.hours.push(labHours);
				} else {
					for (let i = 0; i < labHours.length; ++i) {
						courses.hours[index][i] += labHours[i];
					}
				}
			});
			return courses;
		},
		toColor (id) {
			var hash = 0;
			for (let i = 0; i < id.length; i++) {
				hash = id.charCodeAt(i) + ((hash << 5) - hash);
			}
			var color = '#';
			for (let i = 0; i < 3; i++) {
				var value = (hash >> (i * 8)) & 0xFF;
				color += ('00' + value.toString(16)).substr(-2);
			}
			return color;
		},
		colorNames (names) {
			let colorList = [];
			names.forEach(name => {
				colorList.push('' + this.toColor(name).toUpperCase());
			});
			return colorList;
		},
		reRender () {
			this.graph += 1;
		}
	},
	computed: {
		filteredCourses () {
			return this.getCoursesForPeriod(
				this.$store.state.dateRange.type,
				this.$store.state.dateRange.startDate,
				this.$store.state.dateRange.endDate
			);
		},
		colors () {
			let colorList = [];
			this.filteredCourses.names.forEach(name => {
				colorList.push(this.toColor(name).toUpperCase());
			});
			// Belangrijk want kleuren updaten niet dynamisch
			this.reRender();
			return colorList;
		},
		username () {
			return this.$store.state.username;
		},
		isStudent () {
			if (this.username) {
				return (this.username.charAt(0) === 'r');
			} else {
				return false;
			}
		}
	},
	created () {
		let self = this;
		this.$store.dispatch('resetDateRange');
		(async () => {
			UserService.get(self.username)
				.then((result) => {
					let user = result.data;
					self.userCourses = user.courses;
				});
			let labs = await LabsService.get();
			self.labs = labs.data;
			let worksessions = await WorksessionService.get();
			self.worksessions = worksessions.data;
			this.calcCourses();
		})();
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.page {
	position: relative;
	h1 {
		display: inline;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: #2196F3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	.toggler {
		display: flex;
		flex-direction: row;
	}

	.toggler p {
		margin-left: 1em;
	}

	button {
		position: absolute;
		top: 0;
		right: 0;
		color: $color-content-bg;
		background: $color-accent;
		display: inline-flex;
		flex-direction: row;
		padding: 8px;
		cursor: pointer;
		transition: .2s ease;
		border: 0;

		&:hover {
			background: $color-fg;
		}

		svg {
			fill: $color-content-bg;
			width: 1.5rem;
			height: 1.5rem;
		}

		p {
			padding: 0 8px;
			font: 1rem $font;
			line-height: 1.5rem;
			font-weight: bold;
		}
	}
}

</style>
