<template lang="pug">
	#app
		.content
			app-header
			main.main-width
				router-view
		app-footer
</template>

<script>
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

export default {
	name: 'App',
	components: {
		AppHeader,
		AppFooter
	}
};
</script>

<style lang="scss">
@import 'assets/css/definitions';

@font-face {
	font-family: 'Aleo';
	src: url(assets/fonts/Aleo-Regular.ttf);
	font-weight: normal;
	font-style: normal;
}
@font-face {
	font-family: 'Aleo';
	src: url(assets/fonts/Aleo-Bold.ttf);
	font-weight: bold;
	font-style: normal;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font: 1rem $font;
	color: $color-fg;
	background: $color-bg;
	height: 100%;

	@media screen and (max-width: 1024px) {
		background: $color-fg;
	}
}

#app {
	min-height: 100vh;

	@media screen and (max-width: 1024px) {
		min-height: auto;
	}

	.content {
		min-height: 100vh;
		padding-bottom: 55px;

		@media screen and (max-width: 1024px) {
			padding-bottom: 0;
			min-height: 0;
		}
	}

	footer {
		margin-top: -55px;

		@media screen and (max-width: 1024px) {
			margin-top: 0;
		}
	}
}

.main-width {
	display: block;
	margin: 0 auto;
	width: 80%;

	@media screen and (max-width: 1024px) {
		width: 100%;
	}
}

.right {
	margin-left: auto;
}

main {
	margin-top: 32px !important;
	margin-bottom: 32px !important;
	background: $color-content-bg;
	padding: 32px;

	p {
		padding: 4px 0;
	}

	@media screen and (max-width: 1024px) {
		margin-top: 91px !important;
		margin-bottom: 0 !important;
	}
}

h1 {
	font-size: 32px;
	font-weight: bold;
	padding-bottom: 16px;
}

::-webkit-scrollbar {
	width: 10px;
	background: darken($color-blue-light, 15%);
}

::-webkit-scrollbar-thumb {
	box-shadow: inset 0 0 24px 24px $color-fg;
	border: 2px solid transparent;
	border-radius: 8px;
}

::-webkit-scrollbar-track-piece {
	background: transparent;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>
