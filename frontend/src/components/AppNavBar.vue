<template lang="pug">
	nav
		ul
			li
				router-link(to="/") Home
			li
				router-link(to="/workload") Werklast
			li
				router-link(to="/agenda") Agenda
			li
				router-link(to="/upload") Upload
			li.right
				router-link.highlight(to="/login") Aanmelden
</template>

<script>
export default {
	name: 'AppNavBar'
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

nav {
	position: absolute;
	display: block;
	left: 200px;
	right: 0;
	bottom: 0;

	ul {
		display: flex;
		flex-direction: row;
		list-style: none;

		li a {
			display: block;
			padding: 16px;
			color: $color-content-bg;
			text-decoration: none;
			font-size: 1.2rem;
			line-height: 1.2rem;
			transition: .2s ease;

			&:hover {
				color: $color-fg;
				background: $color-content-bg;
			}

			&.highlight {
				background: $color-fg;
				color: $color-content-bg;

				&:hover {
					background: $color-content-bg;
					color: $color-fg;
				}
			}
		}
	}
}
</style>
