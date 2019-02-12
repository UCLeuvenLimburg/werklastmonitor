<template lang="pug">
	#app
		router-view
</template>

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
}
</style>
