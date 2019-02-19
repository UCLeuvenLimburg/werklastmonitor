<template lang="pug">
	.page.workload
		h1 Werklast
		p
			| Overzicht van werklast per&nbsp;
			select(v-model="selectedFilter", @change="handleChange")
				option(v-for="filter, id in filters", :value="id") {{ filter }}
			input(type="month")
			input(:type="datePickerType")

		graph-stackbar(
			:height="400",
			:labels="labsForPeriod.tags",
			:full-mode="false",
			:show-text="true",
			:names="labsForPeriod.names",
			:values="labsForPeriod.hours")
			legends(:names="labsForPeriod.names", :filter="true")
			tooltip(:names="labsForPeriod.names", position="right")
</template>

<script>
import LabsService from '@/api/LabsService';
import moment from 'moment';

export default {
	name: 'workload',
	data () {
		return {
			labs: [],
			startDate: moment('2019-02-01'),
			endDate: moment('2019-03-01'),
			filters: [
				'Maand',
				'Week',
				'Dag'
			],
			selectedFilter: 0
		};
	},
	methods: {
		handleChange (e) {
			let selection = e.target.options[e.target.options.selectedIndex].valueOf().value;
			if (selection === 'day') {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 3, 5, 2, 5, 2, 3 ],
					[ 8, 5, 6, 10, 2, 1 ],
					[ 10, 5, 7, 5, 1, 2 ],
					[ 8, 10, 7, 4, 2, 2 ]
				];
				this.labels = [ 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag' ];
			} else if (selection === 'week') {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 5, 5, 2, 5 ],
					[ 8, 5, 6, 10 ],
					[ 8, 5, 7, 5 ],
					[ 8, 10, 7, 4 ]
				];
				this.labels = [ '01-07/02', '08-14/02', '15-23/02', '23-30/02' ];
			} else {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 10, 5, 5, 5, 10, 11 ],
					[ 8, 5, 6, 10, 2, 5 ],
					[ 10, 5, 7, 5, 10, 10 ],
					[ 8, 10, 7, 10, 10, 11 ]
				];
				this.labels = [ '01/19', '02/19', '03/19', '04/19', '05/19', '06/19' ];
			};
		},
		getLabsForPeriod (start, end) {
			let self = this;
			let labs = {
				names: [],
				hours: [],
				tags: []
			};

			this.labs.forEach((lab) => {
				if (moment(lab.startDate) < end && moment(lab.endDate) > start) {
				// if (moment(lab.startDate) <= start && moment(lab.endDate) >= end) {
					let diff = moment(lab.endDate).diff(moment(lab.startDate), 'days');
					let amount = lab.hourEstimate / diff;
					let labHours = [];
					for (let i = 0; i < 4; ++i) {
						labHours.push(amount);
					}

					labs.hours.push(labHours);
					labs.names.push(lab.name);

					switch (self.selectedFilter) {
					case self.filters[0]:
						//
						break;

					case self.filters[1]:
						console.log('test 2');
						break;
					}

					labs.tags = [ '02/19', '03/19' ];
				}
			});
			return labs;
		}
	},
	computed: {
		datePickerType () {
			return ['month', 'week', 'date'][this.selectedFilter];
		},
		labsForPeriod () {
			return this.getLabsForPeriod(this.startDate, this.endDate);
		}
	},
	created () {
		let self = this;
		(async () => {
			let labs = await LabsService.get();
			self.labs = labs.data;
		})();
	}
};
</script>
