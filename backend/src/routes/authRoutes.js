const config = require('../config');

const express = require('express');
const {check, validationResult} = require('express-validator/check');

const basicAuth = require('basic-auth')
const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');

// LDAP
const getLDAPConfiguration = (req, callback) => {
	process.nextTick(() => {
		callback(null, {
			server: {
				url: `ldap://${config.ldap.host}:${config.ldap.port}`,
				searchBase: 'ou=Users,ou=Root,dc=int,dc=ucll,dc=be',
				searchFilter: '(cn=*{{username}}*)'
			},
			credentialsLookup: basicAuth
		});
	});
};
passport.use(new LdapStrategy(getLDAPConfiguration, (user, done) => {
	console.log(user);
	return done(null, user);
}));

let authRouter = express.Router();

authRouter.route('/')
	.post([
		check('username').trim().not().isEmpty().withMessage('Username cannot be empty'),
		check('password').trim().not().isEmpty().withMessage('Password cannot be empty')
	], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		passport.authenticate('ldapauth', (err, user, info) => {
			if (err) {
				console.log(err);
			}

			console.log(user);
			console.log(info);

			res.send({
				user,
				info
			});
		});
	});

module.exports = authRouter;
