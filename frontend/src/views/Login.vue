<template lang="pug">
	.page.login
		h1 Aanmelden

		form(@submit.prevent="onSubmit")
			h2 Meld je aan met je R-nummer.

			p
				label(for="username") R-nummer:
				input(type="text", name="username", id="username", v-model="username", placeholder="R-nummer")

			p
				label(for="password") Wachtwoord:
				input(type="password", name="password", id="password", v-model="password", placeholder="Wachtwoord")

			p.submit
				input(type="submit", value="Meld aan")
</template>

<script>
import AuthenticationService from '@/api/AuthenticationService';

export default {
	name: 'Login',
	data () {
		return {
			username: null,
			password: null
		};
	},
	methods: {
		async onSubmit () {
			try {
				let response = await AuthenticationService.post(this.username, this.password);
				localStorage.setItem('jwtToken', response.data.token);
			} catch (err) {
				// TODO: Handle error in form
				console.log(err);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.login {
	form {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;

		h2 {
			padding: 16px;
			text-align: center;
			font-weight: bold;
			font-size: 1.1rem;
		}

		p {
			display: flex;
			flex-direction: row;
			padding: 16px;

			label {
				width: 40%;
				text-align: right;
				padding-right: 16px;
				font-size: 1.05rem;
				line-height: 40px;
			}

			input {
				border-radius: 0;
				outline: none;
				border: 3px solid $color-fg;
				padding: 8px;
				margin-left: 16px;
				font-size: 1.05rem;
				width: calc(60% - 16px);
				max-width: 240px;
				transition: .6s ease;
				background: $color-content-bg;

				&:focus {
					border-color: $color-accent;
				}

				&[type='submit'] {
					margin: 0 auto;
					color: $color-content-bg;
					background: $color-fg;
					cursor: pointer;
					padding: 12px;
					width: 160px;

					&:hover, &:focus {
						background: $color-content-bg;
						color: $color-fg;
					}
				}
			}
		}
	}
}
</style>
