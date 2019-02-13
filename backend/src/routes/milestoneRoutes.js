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
		milestone.lab = req.body.lab;
		milestone.name = req.body.name;
		milestone.duration = req.body.duration;
		milestone.isDone = req.body.isDone;

		milestone.save();
		res.json(milestone);
	});

milestoneRouter.use('/:milestoneId', (req, res, next) => {
	Milestone.findById(req.params.milestoneId, (err, milestone) => {
		if(err) {
			res.status(500).send(err);
		} else {
			req.milestone = milestone;
			next();
		}
	});
});

milestoneRouter.route('/:milestoneId')
	.get((req, res) => {
		res.json(req.milestone);
	})
	.delete((req, res) => {
		req.milestone.remove((err) => {
			if(err) {
				res.status(500).send(err);
			} else {
				res.status(204).send('removed');
			}
		});
	})
	.put((req, res) => {
		req.milestone.name = req.body.milestone.name;
		req.milestone.duration = req.body.milestone.duration;
		req.milestone.isDone = req.body.milestone.isDone;

		req.milestone.save();
		res.json(req.milestone);
	});

module.exports = milestoneRouter;
