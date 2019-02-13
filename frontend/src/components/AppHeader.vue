<template lang="pug">
	header
		.main-width.inner
			router-link(to="/")
				img(src="@/assets/img/logo.svg")

			app-nav-bar
</template>

<script>
import AppNavBar from '@/components/AppNavBar';

export default {
	name: 'AppHeader',
	components: {
		AppNavBar
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

header {
	display: block;
	background: $color-accent;
	color: $color-content-bg;
	width: 100%;

	.inner {
		position: relative;

		img {
			padding: 16px;
			width: 180px;
		}
	}
}
</style>
