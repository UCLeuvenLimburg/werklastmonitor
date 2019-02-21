<template lang="pug">
	.date-range-picker-mask(v-show="visible")
		.date-range-picker-wrapper(ref="dateRangePickerWrapper", @click="outsideBounds($event.target)")
			.date-range-picker-container
				h2.date-range-picker-title
					span(v-if="!startDate") Kies begin datum
					span(v-else) Kies eind datum
					.date-range-picker-types
						button(@click="setType(0); startDate = null", :class="{ active: pickerType === 0 }") Maand
						button(@click="setType(1); startDate = null", :class="{ active: pickerType === 1 }") Week
						button(@click="setType(2); startDate = null", :class="{ active: pickerType === 2 }") Dag
					.date-range-picker-close-button(@click="hide")
						mdi-window-close-icon

				h3.month
					.month-button.prev(@click="prevMonth")
						mdi-chevron-left-icon
					span {{ month | dateFormatMonthFull }}
					.month-button.next(@click="nextMonth")
						mdi-chevron-right-icon

				table(:class="{ 'type-month': pickerType === 0 }", @mouseout="leaveTable")
					tr(@mouseout="leaveTable")
						th Ma
						th Di
						th Wo
						th Do
						th Vr
						th Za
						th Zo
					tr.dates(v-for="week, weekKey of weeks", :class="{ 'type-week': pickerType === 1 }")
						td(v-for="day, dayKey of week",
							:class="{ selectable: !((weekKey === 0 && day > 7) || (weekKey > 1 && day < 8)), 'month-hover': hoveringTable, 'active-cell': isCellActive(week, day) }",
							@click="selectDate(weekKey, dayKey)",
							@mouseover="enterTable(!((weekKey === 0 && day > 7) || (weekKey > 1 && day < 8)))")
							.table-cell {{ day }}
</template>

<script>
import 'mdi-vue/WindowCloseIcon';
import 'mdi-vue/ChevronLeftIcon';
import 'mdi-vue/ChevronRightIcon';

import moment from 'moment';

export default {
	name: 'AppDateRangePicker',
	data () {
		return {
			visible: false,
			pickerType: 1,
			month: moment().date(1),
			weeks: [],
			startDate: null,
			endDate: null,
			hoveringTable: false
		};
	},
	methods: {
		show () {
			// Reset first
			this.month = moment().date(1);
			this.startDate = null;
			this.endDate = null;
			this.hoveringTable = false;
			this.updateCalendar();
			this.visible = true;
		},
		hide () {
			this.visible = false;
		},
		outsideBounds (target) {
			if (target === this.$refs.dateRangePickerWrapper) {
				this.hide();
			}
		},
		prevMonth () {
			this.month.subtract(1, 'month');
			this.updateCalendar();
		},
		nextMonth () {
			this.month = this.month.add(1, 'month');
			this.updateCalendar();
		},
		updateCalendar () {
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
			this.weeks = weeks;
		},
		setType (type) {
			this.pickerType = type;
		},
		selectDate (week, day) {
			let selection = this.weeks[week][day];
			if (this.pickerType !== 1 && ((week === 0 && selection > 7) || (week > 1 && selection < 8))) {
				return;
			}

			if (!this.startDate) {
				switch (this.pickerType) {
				case 0: // Month
					this.startDate = moment(this.month);
					break;

				case 1: // Week
					this.startDate = moment(this.month).add(week, 'weeks').startOf('week');
					break;

				case 2: // Day
					this.startDate = moment(this.month).add(selection - 1, 'days');
					break;
				}
			} else {
				switch (this.pickerType) {
				case 0: // Month
					this.endDate = moment(this.month).endOf('month');
					break;

				case 1: // Week
					this.endDate = moment(this.month).add(week, 'weeks').endOf('week');
					break;

				case 2: // Day
					this.endDate = moment(this.month).add(selection - 1, 'days');
					break;
				}

				this.$store.dispatch('updateDateRange', {
					type: this.pickerType,
					startDate: this.startDate,
					endDate: this.endDate
				});
				this.hide();
			}
		},
		enterTable (shouldHover) {
			this.hoveringTable = shouldHover;
		},
		leaveTable () {
			this.hoveringTable = false;
		},
		isCellActive (week, day) {
			if (this.startDate !== null) {
				switch (this.pickerType) {
				case 0:
					return this.startDate.month() === this.month.month();

				case 1:
					if (this.weeks[0].indexOf(day) > -1 && JSON.stringify(this.weeks[0]) === JSON.stringify(week)) {
						if (moment(this.startDate).add(1, 'month').month() !== this.month.month()) {
							return false;
						}
					} else {
						if (this.startDate.month() !== this.month.month()) {
							return false;
						}
					}
					return week[0] === this.startDate.date() && week[6] === moment(this.startDate).endOf('week').date();

				case 2:
					if (this.startDate.month() === this.month.month() && this.startDate.date() === day) {
						return true;
					} else {
						return false;
					}
				}
			}
			return false;
		}
	},
	created () {
		this.updateCalendar();
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.date-range-picker-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .5);
	display: table;
	user-select: none;

	.date-range-picker-wrapper {
		display: table-cell;
		vertical-align: middle;

		.date-range-picker-container {
			width: 98%;
			max-width: 640px;
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

				.date-range-picker-types {
					position: absolute;
					display: block;
					top: 50%;
					right: 48px;
					transform: translateY(-50%);

					button {
						background: $color-fg;
						color: $color-content-bg;
						border: 0;
						padding: 8px;
						cursor: pointer;
						transition: .2s ease;
						border-right: 1px solid rgba(0, 0, 0, .25);

						&:first-child {
							border-radius: 4px 0 0 4px;
						}

						&:last-child {
							border-right: 0;
							border-radius: 0 4px 4px 0;
						}

						&:hover, &.active {
							background: $color-content-bg;
							color: $color-fg;
						}
					}
				}

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

			.month {
				position: relative;
				padding: 10px;
				text-align: center;

				.next {
					right: 30%;
					width: 35px;
					height: 35px;
				}

				.prev {
					left: 30%;
					width: 35px;
					height: 35px;
				}

				.month-button {
					display: block;
					position: absolute;
					display: inline;
					top: 50%;
					transform: translateY(-50%);
					transition: .2s ease;
					border-radius: 50%;
					cursor: pointer;

					svg {
						fill: $color-fg;
						position: absolute;
						display: block;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}

					&:hover {
						background-color: $color-fg;
						fill: $color-content-bg;

						svg {
							fill: $color-content-bg;
						}
					}
				}
			}

			table {
				padding: 200px;
				width: 100%;
				table-layout: fixed;

				&.type-month .selectable.month-hover {
					background: $color-accent !important;

					.table-cell {
						background: transparent !important;
						color: $color-content-bg !important;
					}
				}

				tr {
					transition: .2s ease;

					&.type-week {
						cursor: pointer;

						td {
							.table-cell {
								background: transparent !important;
							}

							&.active-cell {
								background-color: $color-accent;

								.table-cell {
									color: $color-content-bg !important;
								}
							}
						}

						&:hover {
							background: $color-accent;

							td .table-cell {
								color: $color-content-bg !important;
								background: transparent;
							}
						}
					}

					td {
						text-align: center;
						border: 1px solid rgba(0, 0, 0, .10);
						padding: 10px;

						.table-cell {
							color: $color-fg;
							display: block;
							height: 48px;
							width: 48px;
							border-radius: 50%;
							margin: 0 auto;
							line-height: 48px;
							transition: .2s ease;

							@media screen and (max-width: 680px) {
								height: 32px;
								width: 32px;
								line-height: 32px;
							}
						}

						&.selectable {
							transition: background .2s ease;
							cursor: pointer;

							&:hover .table-cell {
								background-color: $color-accent;
								color: $color-content-bg;
							}

							&.active-cell {
								background-color: $color-accent;

								.table-cell {
									color: $color-content-bg !important;
								}
							}
						}

						&:not(.selectable) .table-cell {
							color: darken($color-content-bg, 35%);
						}
					}

					th {
						background: $color-fg;
						color: $color-content-bg;
						padding: 10px;
					}
				}
			}
		}
	}
}
</style>
