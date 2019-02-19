<template lang="pug">
.main
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
			days: [],
			weeks: []
		};
	},
	methods: {
		showMonths () {
			if (this.monthview) {
				this.monthview = false;
			} else {
				this.monthview = true;
			}
		},
		showWeeks () {
			let count = moment().daysInMonth(this.month);
			this.days = [];
			let week = [];
			for (let i = 1; i < count + 1; i++) {
				let dag = moment().month(this.month).date(i);
				this.days.push(moment().month(this.month).date(i).format('DD'));
				// console.log(moment().month(this.month).date(i));
				console.log(dag.format('DD'));
				if (dag.format('DD') === '01') {
					week = [];
					console.log(dag.day());
					let start = this.lelijk(dag.day());
					console.log('start' + start);
					for (let j = start; j > 0; j--) {
						// console.log(dag.add(-1, 'days').format('dddd - DD'));
						week.push(moment(dag).add(-j, 'days').format('dddd - DD'));
					}
					week.push(dag.format('dddd - DD'));
				}
				else if (dag.day() === 1) {
					this.weeks.push(week);
					week = [];
					week.push(dag.format('dddd - DD'));
				}
				else if (dag.format('DD') == count) {
					week.push(dag.format('dddd - DD'));
					let size = week.length;
					console.log(size);
					for ( let k = size; k < 7; k++)
					{
						week.push(dag.add(1, 'days').format('dddd - DD'));
					}
					this.weeks.push(week);
				}
				else {
					week.push(dag.format('dddd - DD'));
				}
			}
			console.log(this.weeks);
		},
		lelijk (e) {
			switch(e) {
			case 0:
				return 6;
			case 6:
				return 5;
			case 5:
				return 4;
			case 4:
				return 3;
			case 3:
				return 2;
			case 2:
				return 1;
			case 1:
				return 0;
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
.main{
	margin-bottom: 50px;
}
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
