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
			label(for="course") Vak
			select#course(required="" @change='setCourse')
				option(v-if="startFromId" :value="selectedCourse" selected) {{ selectedCourse }}
				option(v-for="course in courses" :key="course" :value="course") {{ course }}
		ul#daylist
			li(v-for="(day, index) in days" :key="day")
				label(:for="day") Aantal uur op dag {{ index + 1 }}
				input(type="number" :id="day" min="0" max="8" value="0" v-model.number="workHours[index]" required)
		button(v-if="submitVisible" v-on:click="submitForm") Toevoegen
</template>

<script>
import moment from 'moment';
export default {
	name: 'addsession',
	data () {
		return {
			days: [],
			beginDate: new Date(2000, 1, 1),
			endDate: new Date(2000, 1, 1),
			beginDateFormatted: '',
			endDateFormatted: '',
			courses: ['BOP', 'Netwerken'],
			minDate: moment(new Date((new Date()).getFullYear(), 0, 1)).format('YYYY-MM-DD'),
			maxDate: moment(new Date((new Date()).getFullYear(), 11, 31)).format('YYYY-MM-DD'),
			submitVisible: false,
			selectedCourse: 'BOP',
			workHours: [],
			message: '',
			startFromId: false
		};
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
		setCourse (e) {
			this.selectedCourse = e.target.options[e.target.options.selectedIndex].valueOf().value;
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
				worksession.studentNumber = 'r0178471';
				worksession.lab = this.selectedCourse;
				let workdays = [];
				for (let i = 0; i < this.days.length; i++) {
					let day = {};
					day.workhours = this.workHours[i];
					day.day = moment(this.beginDate).add(2, 'hours').add(i, 'days').toDate();
					workdays.push(day);
				}
				worksession.workdays = workdays;
				if (!this.startFromId) {
					console.log('Create');
					console.log(worksession);
				} else {
					console.log('Update');
					console.log(worksession);
				}
			}
		}
	},
	beforeMount () {
		console.log('Ok');
		let uri = window.location.search.substring(1);
		let params = new URLSearchParams(uri);
		console.log(params.get('id'));
		let id = params.get('id');
		if (id) {
			this.startFromId = true;
			this.beginDate = new Date(2019, 2, 23);
			this.beginDateFormatted = moment(this.beginDate).format('YYYY-MM-DD');
			this.endDate = new Date(2019, 2, 25);
			this.endDateFormatted = moment(this.endDate).format('YYYY-MM-DD');
			this.selectedCourse = 'Netwerken';
			let filteredCourses = this.courses.filter(e => e !== this.selectedCourse);
			this.courses = filteredCourses;
			this.workHours = [1, 4, 5];
			this.showDays();
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