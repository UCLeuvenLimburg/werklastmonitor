const express = require('express');
const worksession = require('../models/worksession');

const worksessionRouter = express.Router();

worksessionRouter.route('/')
	.get((req, res) => {
		worksession.find({}, (err, worksessions) => {
			res.json(worksessions);
		})
	})
