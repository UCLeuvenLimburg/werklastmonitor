const config = require('./config');
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
	const { headers: { authorization } } = req;

	if (authorization && authorization.split(' ')[0] === 'Token') {
		return authorization.split(' ')[1];
	}
	return null;
};

const auth = {
	required: jwt({
		secret: config.secret,
		getToken: getTokenFromHeaders
	}),
	optional: jwt({
		secret: config.secret,
		getToken: getTokenFromHeaders,
		credentialsRequired: false
	})
};

module.exports = auth;
