const express = require('express');
const Lab = require('../models/labModel');
const Milestone = require('../models/milestoneModel');
const {check, validationResult} = require('express-validator/check');

let labRouter = express.Router();

const getMilestones = async (milestones) => {
	if (milestones.length > 0 && milestones[0].constructor !== String) {
		let milestoneObjects = await Milestone.insertMany(milestones);
		milestones = [];
		for (let milestone of milestoneObjects) {
			milestones.push(milestone._id);
		}
	}
	return await Milestone.find({ _id: { $in: milestones } });
};

labRouter.route('/')
	.get((req, res) => {
		Lab.find(async (err, labs) => {
			if (err) {
				res.status(500).send(err);
			} else {
				for (let i = 0; i < labs.length; ++i) {
					labs[i].milestones = await Milestone.find({ _id: { $in: labs[i].milestones } });
				}

				res.json(labs);
			}
		});
	})
	.post([
		check('name').trim().not().isEmpty().withMessage('Lab name cannot be empty'),
		check('startDate').isISO8601().withMessage('Valid start date is required for lab'),
		// check('endDate').isAfter(new Date('startDate').toDateString()).withMessage('End date of lab must be valid and after start date'),
		check('hourEstimate').isFloat().withMessage('Hour estimation must be a positive number'),
		check('courseId').trim().not().isEmpty().withMessage('Course ID cannot me empty')
		// TODO: check for valid milestones
	] ,async (req, res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let lab = new Lab();
		lab.name = req.body.name;
		lab.startDate = req.body.startDate;
		lab.endDate = req.body.endDate;
		lab.hourEstimate = req.body.hourEstimate;
		lab.courseId = req.body.courseId;
		lab.milestones = await getMilestones(req.body.milestones);

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
	.get(async (req, res) => {
		req.lab.milestones = await Milestone.find({ _id: { $in: req.lab.milestones } });
		res.json(req.lab);
	})
	.put(async (req, res) => {
		req.lab.name = req.body.name;
		req.lab.startDate = req.body.startDate;
		req.lab.endDate = req.body.endDate;
		req.lab.hourEstimate = req.body.hourEstimate;
		req.lab.courseId = req.body.courseId;
		req.lab.milestones = await getMilestones(req.body.milestones);

		req.lab.save();
		res.json(req.lab);
	})
	.delete((req, res) => {
		req.lab.remove((err) => {
			if(err) {
				res.status(500).send(err);
			} else {
				res.status(204).send('removed');
			}
		});
	});

module.exports = labRouter;
