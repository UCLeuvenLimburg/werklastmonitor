const auth = require('../auth');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/userModel');

const express = require('express');
const { check, validationResult } = require('express-validator/check');

let authRouter = express.Router();

passport.use(new LocalStrategy((username, password, done) => {
	if (username.trim() === '' || password.trim() === '') {
		return done(null, false, {
			message: 'Invalid login credentials.'
		});
	}

	// Find user by his username
	// If none found, insert new user into database
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
	.get(auth.optional, async (req, res) => {
		if (!req.user) {
			return res.status(400);
		}
		let user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400);
		}
		return res.json({
			user: user.toAuthJSON()
		});
	})
	.post([
		check('username').trim().not().isEmpty().withMessage('Username cannot be empty'),
		check('password').trim().not().isEmpty().withMessage('Password cannot be empty')
	], async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

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
	});

module.exports = authRouter;
