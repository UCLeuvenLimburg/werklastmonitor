<template lang="pug">
	.page.workload
		h1 Werklast
		button(@click="showDateRangePicker") Kies periode
		app-date-range-picker(ref="dateRangePicker")
		graph-stackbar(
			:height="400",
			:labels="filteredLabs.tags",
			:full-mode="false",
			:show-text="true",
			:names="filteredLabs.names",
			:values="filteredLabs.hours")
			legends(:names="filteredLabs.names", :filter="true")
			tooltip(:names="filteredLabs.names", position="right")
</template>

<script>
import AppDateRangePicker from '@/components/AppDateRangePicker';

import LabsService from '@/api/LabsService';
import moment from 'moment';

export default {
	name: 'workload',
	components: {
		AppDateRangePicker
	},
	data () {
		return {
			labs: []
		};
	},
	methods: {
		showDateRangePicker () {
			this.$refs.dateRangePicker.show();
		},
		getLabsForPeriod (type, start, end) {
			let self = this;
			let labs = {
				names: [],
				hours: [],
				tags: []
			};
			let time = moment(start);

			switch (type) {
			case 0:
				while (time.isBefore(end)) {
					labs.tags.push(time.format('MMMM, YYYY'));
					time.add(1, 'month');
				}
				break;

			case 1:
				while (time.isBefore(end)) {
					labs.tags.push(`${time.format('DD/MM')} - ${moment(time).add(6, 'days').format('DD/MM')}`);
					time.add(1, 'week');
				}
				break;

			case 2:
				while (time.isSameOrBefore(end)) {
					labs.tags.push(time.format('DD/MM'));
					time.add(1, 'day');
				}
				break;
			}

			self.labs.forEach((lab) => {
				let day = moment(lab.startDate);
				let endDay = moment(lab.endDate);
				let labHours = [];

				if (day.isSameOrBefore(end) && endDay.isSameOrAfter(start)) {
					let days = endDay.diff(day, 'days');
					let hoursPerDay = lab.hourEstimate / days;
					let hours = 0;

					day = moment(start);
					while (day.isSameOrBefore(end)) {
						switch (type) {
						case 0:
							hours += hoursPerDay;
							if (day.date() === day.daysInMonth()) {
								labHours.push(hours);
								hours = 0;
							}
							break;

						case 1:
							hours += hoursPerDay;
							if (day.isoWeekday() === 7) {
								labHours.push(hours);
								hours = 0;
							}
							break;

						case 2:
							labHours.push(hoursPerDay);
							break;
						}
						day.add(1, 'day');
					}
				}

				labs.names.push(lab.name);
				labs.hours.push(labHours);
			});

			return labs;
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
		}
	},
	computed: {
		filteredLabs () {
			return this.getLabsForPeriod(
				this.$store.state.dateRange.type,
				this.$store.state.dateRange.startDate,
				this.$store.state.dateRange.endDate
			);
		}
	},
	created () {
		let self = this;
		this.$store.dispatch('resetDatePicker');
		(async () => {
			let labs = await LabsService.get();
			self.labs = labs.data;
		})();
	}
};
</script>
