<template>
	<div id="page addsession">
		<h1>Voeg een werksessie toe</h1>
			<fieldset>
				<label for="beginDate">Begindatum</label>
				<input type="date" name="beginDate" id="beginDate" :min="minDate" :max="maxDate" @change="handleBeginChange">
				<label for="endDate">Einddatum</label>
				<input type="date" name="endDate" id="endDate" :min="minDate" :max="maxDate" @change="handleEndChange">
			</fieldset>
			<fieldset>
				<label for="course">Vak</label>
				<select required id="course">
					<option v-for="course in courses" :key="course">{{ course }}</option>
				</select>
			</fieldset>
			<ul id="daylist">
				<li v-for="(day, index) in days" :key="day">
					<label :for="day">Aantal uur op dag {{ index + 1 }}</label>
					<input type="number" :id="day" min="0" max="8" value="0">
				</li>
			</ul>
		<button v-if="submitVisible" v-on:click="submitForm()" id="submitSession">Toevoegen</button>
	</div>

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
			courses: ['BOP', 'Netwerken'],
			minDate: moment(new Date((new Date()).getFullYear(), 0, 1)).format('YYYY-MM-DD'),
			maxDate: moment(new Date((new Date()).getFullYear(), 11, 31)).format('YYYY-MM-DD'),
			submitVisible: false
		};
	},
	methods: {
		handleBeginChange (e) {
			let selection = e.target.valueOf().value;
			this.beginDate = moment(selection).toDate();
			this.showDays();
		},
		handleEndChange (e) {
			let selection = e.target.valueOf().value;
			this.endDate = moment(selection).toDate();
			this.showDays();
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
		submitForm () {
			console.log('Something');
		}
	}
};
</script>

<style>
	fieldset {
		border: 0px;
	}
	fieldset input, fieldset select, ul input {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	#submitSession {
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

	#submitSession:hover {
		background-color: #003469;
	}
</style>
