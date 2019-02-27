const express = require('express');
const path = require('path')
const staticRouter = express.Router();

staticRouter.route('/template.xlsx')
	.get((req, res) => {
		res.download(path.join(__dirname, '/static/template.xlsx'));
	});

module.exports = staticRouter;
