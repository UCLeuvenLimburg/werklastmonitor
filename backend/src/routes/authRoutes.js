const config = require('../config');

const LdapAuth = require('ldapauth-fork');

const express = require('express');
const {check, validationResult} = require('express-validator/check');

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

		let ldap = new LdapAuth({
			url: `ldap://${config.ldap.host}:${config.ldap.port}`,
			bindDN: `${req.body.username}@ucll.be`,
			bindCredentials: req.body.password,
			searchBase: 'ou=Users,ou=Root,dc=int,dc=ucll,dc=be',
			searchFilter: `(cn=*${req.body.username}*)`
		});
		ldap.authenticate(req.body.username, req.body.password, (err, user) => {
			if (err) {
				console.log(err);
			}
			console.log(user);
			req.user = user;
			res.json(user);
		});
	});

module.exports = authRouter;
