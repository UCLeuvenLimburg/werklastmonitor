<template lang="pug">
	nav
		.mobile-menu(@click="toggleMenu")
			mdi-menu-icon.right(:class="{ open: isMobileMenuOpen }")

		ul(:class="{ mobile: isMobileMenuOpen }", @click="isMobileMenuOpen = false")
			li
				router-link(to="/") Home
			li(v-if='isStudent')
				router-link(to="/courses") Vakken
			li(v-if='isIngelogd')
				router-link(to="/workload") Werklast
			li(v-if='isStudent')
				router-link(to="/agenda") Agenda
			li(v-if='isStudent')
				router-link(to="/addsession") Toevoegen
			li
				router-link(to="/upload") Upload
			li(v-if='isStudent')
				router-link(to="/registration") Inschrijvingen
			li.right(v-if='!isIngelogd')
				router-link.highlight(to="/login") Aanmelden
			li.right(v-if='isIngelogd')
				a.highlight(href="#", @click.prevent="logout") Afmelden

		.mobile-menu-close(v-if="isMobileMenuOpen", @click="isMobileMenuOpen = false")
</template>

<script>
import 'mdi-vue/MenuIcon';

export default {
	name: 'AppNavBar',
	data () {
		return {
			isMobileMenuOpen: false
		};
	},
	computed: {
		username () {
			return this.$store.state.username;
		},
		isStudent () {
			if (this.username) {
				return (this.username.charAt(0) === 'r');
			} else {
				return false;
			}
		},
		isIngelogd () {
			return (this.username);
		}
	},
	methods: {
		toggleMenu () {
			this.isMobileMenuOpen = !this.isMobileMenuOpen;
		},
		logout () {
			localStorage.removeItem('jwtToken');
			this.$store.dispatch('clearUsername');
		}
	}
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

	.mobile-menu {
		display: none;

		@media screen and (max-width: 1024px) {
			display: flex;
			flex-direction: row;
			transition: .2s ease;
			padding: 24px;

			svg {
				width: 42px;
				height: 42px;
				fill: $color-content-bg;
				transition: .2s ease;
				cursor: pointer;

				&:hover, &.open {
					background: $color-content-bg;
					fill: $color-accent;
				}
			}
		}
	}

	.mobile-menu-close {
		display: none;

		@media screen and (max-width: 1024px) {
			position: fixed;
			display: block;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 950;
		}
	}

	ul {
		display: flex;
		flex-direction: row;
		list-style: none;

		@media screen and (max-width: 1024px) {
			display: none;

			&.mobile {
				display: flex;
				flex-direction: column;
				position: fixed;
				top: 91px;
				left: 0;
				width: 100%;
				background: $color-accent;
				overflow-y: visible;
				z-index: 9999;

				li {
					&.right {
						margin-left: 0;
					}

					a {
						text-align: center;
					}
				}
			}
		}

		li a {
			display: block;
			padding: 16px;
			color: $color-content-bg;
			text-decoration: none;
			font-size: 1.2rem;
			line-height: 1.2rem;
			transition: .2s ease;

			&.router-link-exact-active, &:hover, &:focus {
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
