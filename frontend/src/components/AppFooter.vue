<template lang="pug">
	footer
		.main-width.inner
			p.design Designed with &#10084; by Jonas De Roover, Jordy Rymenants, Mario Aquino, Tom Lemmens
			p.right.copyright Copyright &copy; {{ currentYear }} UC Leuven-Limburg
</template>

<script>
import moment from 'moment';

export default {
	name: 'AppFooter',
	computed: {
		currentYear () {
			return moment().year();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

footer {
	flex-shrink: 0;
	display: block;
	width: 100%;
	background: $color-fg;
	color: $color-content-bg;

	.inner {
		display: flex;
		flex-direction: row;
		padding: 16px 64px;

		@media screen and (max-width: 1024px) {
			flex-direction: column;
			padding: 16px 32px;

			p {
				padding-bottom: 16px;
				margin-left: 0;

				&:last-of-type {
					padding-bottom: 0;
				}
			}
		}
	}
}
</style>
