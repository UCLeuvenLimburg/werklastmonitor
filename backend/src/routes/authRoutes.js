const config = require('../config');
const app = require('../index');
const database = require('../database');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LdapAuth = require('ldapauth-fork');

const User = require('../models/userModel');

const express = require('express');
const {check, validationResult} = require('express-validator/check');

let authRouter = express.Router();

passport.use(new LocalStrategy((username, password, done) => {
	if (username.trim().isEmpty() || password.trim().isEmpty()) {
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

app.use(session({
	secret: config.secret,
	store: new MongoStore({
		mongooseConnection: database.connection
	}),
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

authRouter.route('/')
	.post([
		check('username').trim().not().isEmpty().withMessage('Gebruikersnaam mag niet leeg zijn'),
		check('password').trim().not().isEmpty().withMessage('Wachtwoord mag niet leeg zijn')
	], (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		return passport.authenticate('local', (err, user, info) => {
			if (err) {
				next(err);
			}

			console.log(user);
			console.log(info);

			return res.json({
				user
			});
		})(req, res, next);
	});

module.exports = authRouter;
