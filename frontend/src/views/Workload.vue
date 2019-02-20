<template lang="pug">
	.page.workload
		h1 Werklast
		button(@click="showDateRangePicker")
			mdi-calendar-icon
			p Kies periode
		app-date-range-picker(ref="dateRangePicker")
		graph-stackbar(
			:height="400",
			:labels="filteredLabs.tags",
			:full-mode="false",
			:show-text="true",
			:names="filteredLabs.names",
			:values="filteredLabs.hours",
			:colors="colors",
			:key="graph")
			legends(:names="filteredLabs.names", :filter="true")
			tooltip(:names="filteredLabs.names", position="right")
</template>

<script>
import 'mdi-vue/CalendarIcon';
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
			labs: [],
			graph: 0
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

					if (day.isBefore(start)) {
						day = moment(start);
					}
					while (day.isSameOrBefore(end) && day.isSameOrBefore(endDay)) {
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
		},
		colorNames (names) {
			let colorList = [];
			names.forEach(name => {
				console.log(this.toColor(name));
				colorList.push('' + this.toColor(name).toUpperCase());
			});
			return colorList;
		},
		reRender () {
			this.graph += 1;
		}
	},
	computed: {
		filteredLabs () {
			return this.getLabsForPeriod(
				this.$store.state.dateRange.type,
				this.$store.state.dateRange.startDate,
				this.$store.state.dateRange.endDate
			);
		},
		colors () {
			let colorList = [];
			this.filteredLabs.names.forEach(name => {
				colorList.push(this.toColor(name).toUpperCase());
			});
			// Belangrijk want kleuren updaten niet dynamisch
			this.reRender();
			return colorList;
		}
	},
	created () {
		let self = this;
		this.$store.dispatch('resetDateRange');
		(async () => {
			let labs = await LabsService.get();
			self.labs = labs.data;
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

	button {
		position: absolute;
		right: 0;
		margin-top: 4px;
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
