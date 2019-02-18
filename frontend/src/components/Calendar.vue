<template lang="pug">
div
	h1 Dit is een test
	ul.index
		li(v-on:click="showMonths") Maand
		li(v-on:click="showWeeks") Week
		li Dag
	ul.months
		li(v-for="month in months" v-if="monthview" v-on:click="getMonth(month.value)") {{month.name}}
	.weekpicker
		h3 {{month}}
			table.calendar
				tr
					th Ma
					th Di
					th Woe
					th Do
					th Vr
					th Za
					th Zo

</template>

<script>
import moment from 'moment';
export default {
	name: 'Calendar',
	data () {
		return {
			months: [ { name: 'Januari', value: '1' } , { name: 'Februari', value: '2' }, { name: 'Maart', value: '3' }, { name: 'April', value: '4' }, { name: 'Mei', value: '5' }, { name: 'Juni', value: '6' }, { name: 'Juli', value: '7' }, { name: 'Augustus', value: '8' }, { name: 'September', value: '9' }, { name: 'Oktober', value: '10' }, { name: 'November', value: '11' }, { name: 'December', value: '12' }],
			monthview: false,
			month: moment().format('MMMM'),
			daysInMonth: moment().daysInMonth(),
			days: []
		};
	},
	methods: {
		showMonths () {
			console.log('fired');
			this.monthview = true;
		},
		showWeeks () {
			let count = moment().daysInMonth(this.month);
			this.days = [];
			for(let i=1; i< count + 1; i++) {
				this.days.push(moment().month(this.month).date(i).format('DD'));
				console.log(moment().month(this.month).date(i));
			}
		},
		getMonth (e) {
			console.log(e);
			return e;
		}
	}
};
</script>

<style lang="scss" scoped>
.index{
	color: blue;
	list-style: none;
	li {
		text-decoration: none;
		cursor: pointer;
	}
}

.months {
	display: flex;
	width: 10%;
	flex-direction: row;
	flex-basis: 50%;
	list-style: none;

	li{
		display: block;
		padding: 16px;
		text-decoration: none;
		margin: 10px;
		color: white;
		background: blue;
		// font-size: 1.2rem;
		// line-height: 1.2rem;
		// transition: .2s ease;
	}
	li:hover{
		color: blue;
		background: white;
		cursor: pointer;
	}
}
</style>
