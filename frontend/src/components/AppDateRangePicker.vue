<template lang="pug">
	.date-range-picker-mask(v-show="visible")
		.date-range-picker-wrapper(ref="dateRangePickerWrapper", @click="outsideBounds($event.target)")
			.date-range-picker-container
				h2.date-range-picker-title Kies periode
					.date-range-picker-close-button(@click="hide")
						mdi-window-close-icon

				table
					tr
						th Ma
						th Di
						th Wo
						th Do
						th Vr
						th Za
						th Zo
					tr.dates(v-for="week, weekKey of weeks", :ref="`week-${weekKey}`")
						td(v-for="day, dayKey of week", :ref="`weekday-${weekKey}-${dayKey}`") {{ day }}
</template>

<script>
import 'mdi-vue/WindowCloseIcon';

import moment from 'moment';

export default {
	name: 'AppDateRangePicker',
	props: [
		'type',
		'range'
	],
	data () {
		return {
			visible: false,
			month: moment().date(1)
		};
	},
	methods: {
		show () {
			this.visible = true;
		},
		hide () {
			this.visible = false;
		},
		outsideBounds (target) {
			if (target === this.$refs.modalWrapper) {
				this.hide();
			}
		}

	},
	computed: {
		weeks () {
			let weeks = [];
			let week = [];
			let daysInPrevMonth = moment(this.month).subtract(1, 'month').daysInMonth();
			for (let i = daysInPrevMonth - this.month.isoWeekday() + 2; i <= daysInPrevMonth; ++i) {
				week.push(i);
			}
			for (let i = 1; i <= this.month.daysInMonth(); ++i) {
				if (week.length > 6) {
					weeks.push(week);
					week = [];
				}
				week.push(i);
			}
			for (let i = 1; week.length < 7; ++i) {
				week.push(i);
			}
			weeks.push(week);
			return weeks;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.date-range-picker-mask {
	position: fixed;
	z-index: 998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .5);
	display: table;

	.date-range-picker-wrapper {
		display: table-cell;
		vertical-align: middle;

		.date-range-picker-container {
			width: 640px;
			margin: 0 auto;
			background: $color-content-bg;
			border-radius: 4px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

			.date-range-picker-title {
				position: relative;
				padding: 16px;
				background: $color-accent;
				color: $color-content-bg;
				border-radius: 4px 4px 0 0;
				font-size: 18px;

				.date-range-picker-close-button {
					position: absolute;
					display: block;
					top: 50%;
					right: 16px;
					transform: translate(0, -50%);
					height: 24px;
					width: 24px;
					border-radius: 50%;
					cursor: pointer;
					transition: .2s ease;

					&:hover {
						background: $color-content-bg;

						svg {
							fill: $color-fg;
						}
					}

					svg {
						position: absolute;
						display: block;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						height: 16px;
						width: 16px;
						fill: $color-content-bg;
					}
				}
			}

			table {
				width: 100%;

				th {
					background: $color-fg;
					color: $color-content-bg;
				}
			}
		}
	}
}
</style>
