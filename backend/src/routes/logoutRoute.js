const express = require('express');
const logoutRouter = express.Router();

logoutRouter.route('/')
	.get((req, res) => {
		req.session.destroy();
		res.status('200').send('Logged out');
	});
module.exports = logoutRouter;
