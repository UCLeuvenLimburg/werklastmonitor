const express = require('express');
const Lab = require('../models/labModel');
const Milestone = require('../models/milestoneModel');

let labRouter = express.Router();

labRouter.route('/')
	.get((req, res) => {
		Lab.find((err, labs) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(labs);
			}
		});
	})
	.post(async (req, res) => {
		let lab = new Lab();
		lab.name = req.body.name;
		lab.startDate = req.body.startDate;
		lab.endDate = req.body.endDate;
		lab.hoursEstimate = req.body.hoursEstimate;

		let milestones = req.body.milestones;
		if (milestones.length > 0) {
			if (milestones[0].constructor === String) {
				lab.milestones = await Milestone.find({ _id: { $in: milestones } });
			} else {
				lab.milestones = await Milestone.insertMany(req.body.milestones);
			}
		}

		lab.save();
		res.json(lab);
	});

labRouter.use('/:labId', (req, res, next) => {
	Lab.findById(req.params.labId, (err, lab) => {
		if(err) {
			res.status(500).send(err);
		} else {
			req.lab = lab;
			next();
		}
	});
});

labRouter.route('/:labId')
	.get((req, res) => {
		res.json(req.lab);
	})
	.put(async (req, res) => {
		req.lab.name = req.body.name;
		req.lab.startDate = req.body.startDate;
		req.lab.endDate = req.body.endDate;
		req.lab.hoursEstimate = req.body.hoursEstimate;

		let milestones = req.body.milestones;
		if (milestones.length > 0) {
			if (milestones[0].constructor === String) {
				req.lab.milestones = await Milestone.find({ _id: { $in: milestones } });
			} else {
				req.lab.milestones = await Milestone.insertMany(req.body.milestones);
			}
		}

		req.lab.save();
		res.json(req.lab);
	});

module.exports = labRouter;
