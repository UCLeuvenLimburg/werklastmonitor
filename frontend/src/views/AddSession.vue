<template lang="pug">
	.page.addsession
		h1(v-if="!startFromId") Voeg een werksessie toe
		h1(v-else) Pas een werksessie aan
		ul(v-if="errors.length !== 0").errorlist
			li(v-for="error in errors").error {{error.param}}: {{error.msg}}

		p {{ message }}

		fieldset
			label(for="beginDate") Begindatum
			input#beginDate(type="date" name="beginDate" :min="minDate" :max="maxDate" :value="beginDateFormatted" @change="handleBeginChange")
			label(for="endDate") Einddatum
			input#endDate(type="date" name="endDate" :min="minDate" :max="maxDate" :value="endDateFormatted" @change="handleEndChange")

		fieldset(v-if="!startFromId")
			label(for="lab"  v-if="!startFromId") Opdracht
			select#lab(required="" @change="setLab" v-if="!startFromId")
				option(v-for="lab in labs" :key="lab._id" :value="lab._id") {{ lab.name }} ({{ lab.course.name }})

		ul#daylist
			li(v-for="(day, index) in days" :key="day")
				label(:for="day") Aantal uur op dag {{ index + 1 }}
				input(type="number" :id="day" min="0" max="8" value="0" v-model.number="workHours[index]" required)

		button(v-if="submitVisible" v-on:click="submitForm")
			span(v-if="!startFromId") Toevoegen
			span(v-else) Aanpassen
</template>

<script>
import moment from 'moment';
import LabsService from '@/api/LabsService';
import UserService from '../api/UsersService.js';
import WorksessionService from '@/api/WorksessionService';
import WorkdaysService from '@/api/WorkdaysService.js';
export default {
	name: 'addsession',
	data () {
		return {
			days: [],
			beginDate: new Date(2000, 1, 1),
			endDate: new Date(2000, 1, 1),
			beginDateFormatted: '',
			endDateFormatted: '',
			labs: [],
			minDate: moment(new Date((new Date()).getFullYear(), 0, 1)).format('YYYY-MM-DD'),
			maxDate: moment(new Date((new Date()).getFullYear(), 11, 31)).format('YYYY-MM-DD'),
			submitVisible: false,
			selectedLab: '',
			workHours: [],
			message: '',
			startFromId: false,
			id: '',
			errors: []
		};
	},
	computed: {
		username () {
			return this.$store.state.username;
		}
	},
	methods: {
		handleBeginChange (e) {
			let selection = e.target.valueOf().value;
			this.beginDate = moment(selection).add(2, 'hours').toDate();
			this.showDays();
			this.beginDateFormatted = moment(this.beginDate).format('YYYY-MM-DD');
		},
		handleEndChange (e) {
			let selection = e.target.valueOf().value;
			this.endDate = moment(selection).add(2, 'hours').toDate();
			this.showDays();
			this.endDateFormatted = moment(this.endDate).format('YYYY-MM-DD');
		},
		showDays () {
			if (this.beginDate >= moment(this.minDate).toDate() && this.endDate >= moment(this.minDate).toDate() && this.beginDate <= this.endDate) {
				let nDays = moment(this.endDate).diff(moment(this.beginDate), 'days') + 1;
				this.days = [];
				for (let i = 0; i < nDays; i++) {
					this.days.push('day' + (i + 1));
				}
				this.submitVisible = true;
			} else {
				this.days = [];
				this.submitVisible = false;
			}
		},
		setLab (e) {
			this.selectedLab = e.target.options[e.target.options.selectedIndex].valueOf().value;
		},
		submitForm () {
			let self = this;
			this.errors = [];
			let numeric = true;
			for (let i = 0; i < this.workHours.length; i++) {
				if (isNaN(this.workHours[i]) || this.workHours[i] === '' || this.workHours[i] < 0 || this.workHours[i] > 8) {
					numeric = false;
				}
			}
			if (this.workHours.length !== this.days.length || !numeric) {
				let error = {};
				error.param = 'Werkuren';
				error.msg = 'Je dient voor elke dag een aantal werkuren tussen 0 en 8 in te vullen.';
				this.errors.push(error);
				// this.message = 'Je dient voor elk dag een aantal werkuren tussen 0 en 8 in te vullen.';
			} else {
				let worksession = {};
				worksession.startDate = moment(this.beginDate).add(2, 'hours').toDate();
				worksession.endDate = moment(this.endDate).add(2, 'hours').toDate();
				worksession.studentNumber = this.username;
				worksession.lab = this.selectedLab;
				let workdays = [];
				for (let i = 0; i < this.days.length; i++) {
					let day = {};
					day.workhours = this.workHours[i];
					day.day = moment(this.beginDate).add(2, 'hours').add(i, 'days').toDate();
					workdays.push(day);
				}
				worksession.workdays = workdays;
				if (!this.startFromId) {
					(async () => {
						await WorksessionService.post(worksession)
							.catch((err) => {
								err.response.data.errors.forEach((err) => {
									self.errors.push(err);
								});
							});
					})();
				} else {
					worksession._id = this.id;
					(async () => {
						await WorksessionService.put(worksession)
							.catch((err) => {
								err.response.data.errors.forEach((err) => {
									self.errors.push(err);
								});
							});
					})();
				}
				this.beginDate = new Date(2000, 1, 1);
				this.endDate = new Date(2000, 1, 1);
				this.showDays();
				if (this.errors.length === 0) {
					this.message = 'Ontvangen!';
				}
			}
		}
	},
	beforeMount () {
		(async () => {
			UserService.get(this.username)
				.then((result) => {
					let user = result.data;
					this.userCourses = user.courses;
				});
			this.labs = [];
			let labs = await LabsService.get();
			let unfilteredLabs = labs.data;
			unfilteredLabs.forEach((lab) => {
				if (this.userCourses.includes(lab.course._id)) {
					this.labs.push(lab);
				}
			});
			this.selectedLab = this.labs[0];
			this.id = this.$route.params.id;
			if (this.id) {
				let worksessionrequest = await WorksessionService.getId(this.id);
				let worksession = worksessionrequest.data;
				let workdayrequest = await WorkdaysService.get();
				let workdays = workdayrequest.data;
				this.startFromId = true;
				this.beginDate = moment(worksession.startDate).toDate();
				this.beginDateFormatted = moment(this.beginDate).format('YYYY-MM-DD');
				this.endDate = moment(worksession.endDate).toDate();
				this.endDateFormatted = moment(this.endDate).format('YYYY-MM-DD');
				this.selectedLab = worksession.lab;
				this.workHours = [];
				worksession.workdays.forEach((workday) => {
					let workdayGrab = workdays.find((item) => item._id === workday);
					this.workHours.push(workdayGrab.workhours);
				});
				this.showDays();
			}
		})();
	}
};
</script>

<style lang="scss" scoped>
	fieldset {
		border: 0;
	}
	input, select {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	button {
		width: 100%;
		background-color: #e00049;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: medium;
		font-weight: bold;
	}

	ul {
		list-style-type: none;
	}

	button:hover {
		background-color: #003469;
	}

	.error {
			color: red;
			margin: 1%;
		}

	.errorlist {
		list-style: none;
		border-style: solid;
		border-width: 2px;
		border-color: red;
	}
</style>
