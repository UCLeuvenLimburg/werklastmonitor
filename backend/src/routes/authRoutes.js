const config = require('../config');

const auth = require('../auth');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const LdapAuth = require('ldapauth-fork');

const User = require('../models/userModel');

const express = require('express');
const {check, validationResult} = require('express-validator/check');

let authRouter = express.Router();

passport.use(new LocalStrategy((username, password, done) => {
	if (username.trim() === '' || password.trim() === '') {
		return done(null, false, {
			message: 'Login gegevens zijn ongeldig.'
		});
	}

	let ldap = new LdapAuth({
		url: `ldap://${config.ldap.host}:${config.ldap.port}`,
		bindDN: `${username}@ucll.be`,
		bindCredentials: password,
		searchBase: 'ou=Users,ou=Root,dc=int,dc=ucll,dc=be',
		searchFilter: `(cn=*${username}*)`
	});
	ldap.authenticate(username, password, (err, user) => {
		ldap.close();
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {
				message: 'Login gegevens zijn ongeldig.'
			});
		}

		User.findById(username, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				let user = new User();
				user._id = username;
				user.courses = [];
				user.milestones = [];
				user.save();
				return done(null, user);
			}
			return done(null, user);
		});
	});
}));

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((username, done) => {
	User.findById(username, (err, user) => {
		done(err, user);
	});
});

authRouter.route('/')
	.post([
		check('username').trim().not().isEmpty().withMessage('Gebruikersnaam mag niet leeg zijn') // ,
		// check('password').trim().not().isEmpty().withMessage('Wachtwoord mag niet leeg zijn')
	], async (req, res) => { // , next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		User.findById(req.body.username, (err, user) => {
			if (!user) {
				user = new User();
				user._id = req.body.username;
				user.courses = [];
				user.milestones = [];
				user.save();
			}
			return res.json(user);
		});

		/*
		return passport.authenticate('local', (err, passportUser) => {
			if (err) {
				return next(err);
			}
			if (passportUser) {
				const user = passportUser;
				user.token = passportUser.generateJWT();

				return res.json(user.toAuthJSON());
			}
			return res.status(400).info;
		})(req, res, next);
		*/
	})
	.get(auth.required, async (req, res) => {
		let user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400);
		}
		return res.json({
			user: user.toAuthJSON()
		});
	});

module.exports = authRouter;
