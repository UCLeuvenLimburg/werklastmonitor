const express = require('express');
const secret = require('../secrets')
const autrouter = express.Router();
const fetch = require('node-fetch');

autrouter.route('/')
	.get((req, res) => {
		res.status('200').send(`https://papi.ucll.be/oauth/authorize?client_id=${secret.Oauth.clientId}&redirect_uri=${secret.Oauth.callbackUrl}&response_type=code&scope=READ_PERSON_INFO`)
	})
	.post((req, res) => {
		let code = req.body.code;
		let creds = Buffer.from(`${secret.Oauth.clientId}:${secret.Oauth.clientPw}`).toString('base64');

		fetch(`https://papi.ucll.be/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${secret.Oauth.callbackUrl}`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${creds}`
			}
		}).then(result => {
			console.log(result.status);
			if(!result.ok) {
				console.error('invalid client id');
				Promise.reject();
			} else {
				return result.json();
			}
		}).then(async result => {
			req.session.token = result.access_token;
			console.log('session: ' + req.session.token);
			let info = await askInfo(result.access_token);
			console.log('second print ' + info);
			res.status('200').send(info);
		});
	});
function askInfo(token) {
	return fetch('https://papi.ucll.be/auth/info', {
		method: 'GET',
		headers : {
			'Authorization': `Bearer ${token}`
		}
	}).then(result => result.json()).then(result => {
		return result;
	});
}
module.exports = autrouter;
