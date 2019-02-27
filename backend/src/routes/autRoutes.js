const express = require('express');
const secret = require('../secrets')
const autrouter = express.Router();

autrouter.route('/')
	.get((req, res) => {
		res.status('200').send(`https://papi.ucll.be/oauth/authorize?client_id=${secret.Oauth.clientId}&redirect_uri=${secret.Oauth.callbackUrl}&response_type=code&scope=READ_PERSON_INFO`)
	});
module.exports = autrouter;
