const express = require('express');
const Lab = require('../models/milestoneModel');

let labRouter = express.Router();

labRouter.route('/')
	.get((req, res) => {
		Lab.find({}, (err, labs) => {
			res.json(labs);
		});
	});

module.exports = labRouter;
