<template lang="pug">
	.page.addsession
		h1 Voeg een werksessie toe
		div
			p {{ message }}
		fieldset
			label(for="beginDate") Begindatum
			input#beginDate(type="date" name="beginDate" :min="minDate" :max="maxDate" :value="beginDateFormatted" @change="handleBeginChange")
			label(for="endDate") Einddatum
			input#endDate(type="date" name="endDate" :min="minDate" :max="maxDate" :value="endDateFormatted" @change="handleEndChange")
		fieldset
			label(for="lab") Opdracht
			select#lab(required="" @change='setLab')
				option(v-if="startFromId" :value="selectedLab._id" selected) {{ selectedLab.name }} ({{ selectedLab.course.name }})
				option(v-for="lab in labs" :key="lab" :value="lab._id") {{ lab.name }} ({{ lab.course.name }})
		ul#daylist
			li(v-for="(day, index) in days" :key="day")
				label(:for="day") Aantal uur op dag {{ index + 1 }}
				input(type="number" :id="day" min="0" max="8" value="0" v-model.number="workHours[index]" required)
		button(v-if="submitVisible" v-on:click="submitForm") Toevoegen
</template>

<script>
import moment from 'moment';
import LabsService from '@/api/LabsService';
import UserService from '../api/UsersService.js';
import WorksessionService from '@/api/WorksessionService';
export default {
	name: 'addsession',
	data () {
		return {
			days: [],
			beginDate: new Date(2000, 1, 1),
			endDate: new Date(2000, 1, 1),
			beginDateFormatted: '',
			endDateFormatted: '',
			labs: ['BOP', 'Netwerken'],
			minDate: moment(new Date((new Date()).getFullYear(), 0, 1)).format('YYYY-MM-DD'),
			maxDate: moment(new Date((new Date()).getFullYear(), 11, 31)).format('YYYY-MM-DD'),
			submitVisible: false,
			selectedLab: 'BOP',
			chosenLab: '',
			workHours: [],
			message: '',
			startFromId: false,
			id: ''
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
			this.beginDate = moment(selection).toDate();
			this.showDays();
			this.beginDateFormatted = moment(this.beginDate).format('YYYY-MM-DD');
		},
		handleEndChange (e) {
			let selection = e.target.valueOf().value;
			this.endDate = moment(selection).toDate();
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
			this.chosenLab = e.target.options[e.target.options.selectedIndex].valueOf().value;
		},
		submitForm () {
			let numeric = true;
			for (let i = 0; i < this.workHours.length; i++) {
				if (isNaN(this.workHours[i]) || this.workHours[i] === '' || this.workHours[i] < 0 || this.workHours[i] > 8) {
					numeric = false;
				}
			}
			if (this.workHours.length !== this.days.length || !numeric) {
				this.message = 'Je dient voor elk dag een aantal werkuren tussen 0 en 8 in te vullen.';
			} else {
				let worksession = {};
				worksession.startDate = moment(this.beginDate).add(2, 'hours').toDate();
				worksession.endDate = moment(this.endDate).add(2, 'hours').toDate();
				worksession.studentNumber = this.username;
				// worksession.lab = this.selectedCourse;
				worksession.lab = this.chosenLab;
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
						await WorksessionService.post(worksession);
					})();
				} else {
					worksession._id = this.id;
					(async () => {
						await WorksessionService.put(worksession);
					})();
				}
				this.beginDate = new Date(2000, 1, 1);
				this.endDate = new Date(2000, 1, 1);
				this.showDays();
				this.message = 'Ontvangen!';
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
			unfilteredLabs.forEach(lab => {
				if (this.userCourses.includes(lab.course._id)) {
					this.labs.push(lab);
				}
			});
		})();
		let uri = window.location.search.substring(1);
		let params = new URLSearchParams(uri);
		this.id = params.get('id');
		if (this.id) {
			(async () => {
				let worksessionrequest = await WorksessionService.getId(this.id);
				let worksession = worksessionrequest.data;
				this.startFromId = true;
				this.beginDate = moment(worksession.startDate).toDate();
				this.beginDateFormatted = moment(this.beginDate).format('YYYY-MM-DD');
				this.endDate = moment(worksession.endDate).toDate();
				this.endDateFormatted = moment(this.endDate).format('YYYY-MM-DD');
				this.selectedLab = 'Netwerken';
				let filteredLabs = this.labs.filter(e => e !== this.selectedLab);
				this.labs = filteredLabs;
				this.workHours = [];
				worksession.workdays.forEach(workday => {
					// this.workHours.push(workday.workhours);
					this.workHours.push(2);
				});
				this.showDays();
			})();
		}
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
</style>
