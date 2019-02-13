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
}

#app {
	min-height: 100vh;

	.content {
		min-height: 100vh;
		padding-bottom: 54px;
	}

	footer {
		margin-top: -54px;
	}
}

.main-width {
	display: block;
	margin: 0 auto;
	width: 80%;
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
}

h1 {
	font-size: 32px;
	font-weight: bold;
	padding-bottom: 16px;
}
</style>
