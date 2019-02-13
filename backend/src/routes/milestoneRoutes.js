const express = require('express');
const Milestone = require('../models/milestoneModel');
const {check, validationResult} = require('express-validator/check');

let milestoneRouter = express.Router();

milestoneRouter.route('/')
	.get((req, res) => {
		Milestone.find({}, (err, milestones) => {
			res.json(milestones);
		});
	})
	.post([
<<<<<<< HEAD
		check('name').not().isEmpty().withMessage('Milestone name cannot be empty'),
		check('duration').isInt({ min: 0 }).withMessage('Milestone duration must be an integer'),
=======
		check('name').trim().not().isEmpty().withMessage('Milestone name cannot be empty'),
		check('duration').isInt().withMessage('Milestone duration cannot be empty'),
>>>>>>> 4761a9d3898f45669d6909564cbb106bef10001f
		check('isDone').isBoolean().withMessage('Milestone isDone must be a boolean')
	], (req, res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let milestone = new Milestone();
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
	.put([
		check('name').not().isEmpty().withMessage('Milestone name cannot be empty'),
		check('duration').isInt({ min: 0 }).withMessage('Milestone duration must be an integer'),
		check('isDone').isBoolean().withMessage('Milestone isDone must be a boolean')
	], (req, res) => {
		req.milestone.name = req.body.milestone.name;
		req.milestone.duration = req.body.milestone.duration;
		req.milestone.isDone = req.body.milestone.isDone;

		req.milestone.save();
		res.json(req.milestone);
	});

module.exports = milestoneRouter;
