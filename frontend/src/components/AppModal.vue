<template lang="pug">
	.modal-mask(v-show="visible")
		.modal-wrapper(ref="modalWrapper", @click="outsideBounds($event.target)")
			.modal-container
				h2.modal-title(v-if="hasTitle")
					slot(name="title")
					.modal-close-button(@click="hide")
						mdi-window-close-icon

				.modal-content
					slot Modal has no content!

				.modal-controls(v-if="hasControls")
					slot(name="controls")
</template>

<script>
import 'mdi-vue/WindowCloseIcon';

export default {
	name: 'AppModal',
	data () {
		return {
			visible: false
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
		hasTitle () {
			return !!this.$slots['title'];
		},
		hasControls () {
			return !!this.$slots['controls'];
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.modal-mask {
	position: fixed;
	z-index: 998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .5);
	display: table;

	.modal-wrapper {
		display: table-cell;
		vertical-align: middle;

		.modal-container {
			width: 480px;
			margin: 0 auto;
			background: $color-content-bg;
			border-radius: 4px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

			.modal-title {
				position: relative;
				padding: 16px;
				background: $color-accent;
				color: $color-content-bg;
				border-radius: 4px 4px 0 0;
				font-size: 18px;

				.modal-close-button {
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

			.modal-content {
				padding: 16px;
			}

			.modal-controls {
				background: $color-fg;
				color: $color-content-bg;
				border-radius: 0 0 4px 4px;
				padding: 16px;
				text-align: center;
			}
		}
	}
}
</style>
