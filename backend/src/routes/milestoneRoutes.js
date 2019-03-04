const express = require('express');
const Milestone = require('../models/milestoneModel');
const { check, validationResult } = require('express-validator/check');

let milestoneRouter = express.Router();

const getValidationChecks = () => {
	return [
		check('name').trim().not().isEmpty().withMessage('Milestone name cannot be empty'),
		check('duration').isFloat({ min: 0 }).withMessage('Milestone duration must be an integer')
	];
};

milestoneRouter.route('/')
	.get((req, res) => {
		Milestone.find({}, (err, milestones) => {
			res.json(milestones);
		});
	})
	.post(getValidationChecks(), (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let milestone = new Milestone();
		milestone.name = req.body.name;
		milestone.duration = req.body.duration;

		milestone.save();
		res.json(milestone);
	})
	.delete((req, res) => {
		Milestone.remove({}, (err) => {
			res.send(err);
		});
	});

milestoneRouter.use('/:milestoneId', (req, res, next) => {
	Milestone.findById(req.params.milestoneId, (err, milestone) => {
		if (err) {
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
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(204).send('removed');
			}
		});
	})
	.put(getValidationChecks(), (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		req.milestone.name = req.body.name;
		req.milestone.duration = req.body.duration;

		req.milestone.save();
		res.json(req.milestone);
	});

module.exports = milestoneRouter;
