const moment = require('moment');
const express = require('express');
const Workday = require('../models/workdayModel');
const { body, validationResult } = require('express-validator/check');

const workdayRouter = express.Router();

workdayRouter.route('/')
	.get((req, res) => {
		Workday.find({}, (err, workdays) => {
			res.json(workdays);
		});
	})
	.post([
		body('day').isISO8601().custom((value) => moment(value) >= moment().subtract(1, 'years')).withMessage('Please enter a valid date'),
		body('workhours').isFloat({min: 0, max: 24}).withMessage('Invalid ammount of hours')
	], (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}
		let workday = new Workday();
		workday.day = req.body.day;
		workday.workhours = req.body.workhours;
		workday.save();
		res.status('201').send(workday);
	})
	.delete((req, res) => {
		Workday.deleteMany((err) => {
			if (err) {
				res.status('500').send(err);
			} else {
				res.status('204').send(err);
			}
		})
	});

workdayRouter.use('/:workday_Id', (req, res, next) => {
	Workday.findById(req.params.workday_Id, (err, workday) => {
		if (err) {
			res.status('500').send(err);
		} else {
			req.workday = workday;
			next();
		}
	});
});

workdayRouter.route('/:workday_Id')
	.get((req, res) => {
		res.json(req.workday);
	})
	.put([
		body('day').isISO8601().custom((value) => moment(value) >= moment().subtract(1, 'years')).withMessage('Please enter a valid date'),
		body('workhours').isFloat({ min: 0, max: 24 }).withMessage('Invalid ammount of hours')
	], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}

		req.workday.day = req.body.day;
		req.workday.workhours = req.body.workhours;
		req.workday.save();
		res.json(req.workday);
	})
	.delete((req, res) => {
		req.worksession.remove((err) => {
			if (err) {
				res.status('500').send(err)
			} else {
				res.status('204').send('removed')
			}
		});
	});

module.exports = workdayRouter;
