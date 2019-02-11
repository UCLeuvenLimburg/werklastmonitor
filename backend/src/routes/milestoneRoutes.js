const express = require('express');
const Milestone = require('../models/milestoneModel');

let milestoneRouter = express.Router();

milestoneRouter.route('/')
	.get((req, res) => {
		Milestone.find({}, (err, milestones) => {
			res.json(milestones);
		});
	})
	.post((req, res) => {
		let milestone = new Milestone();
		milestone.name = req.body.name;
		milestone.duration = req.body.duration;
		milestone.isDone = req.body.isDone;

		milestone.save();
		res.json(milestone);
	});

module.exports = milestoneRouter;
