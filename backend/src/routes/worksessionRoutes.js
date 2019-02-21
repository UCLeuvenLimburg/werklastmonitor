const express = require('express');
const Worksession = require('../models/worksessionModel');
const Workday = require('../models/workdayModel');
const { body, validationResult } = require('express-validator/check');
const moment = require('moment');

const worksessionRouter = express.Router();

worksessionRouter.route('/')
	.get((req, res) => {
		Worksession.find({}, async (err, worksessions) => {
			if (err) {
				res.status('500').send(err);
			}
			else {
				for (let i = 0; i < worksessions.length; ++i) {
					worksessions[i].workdays = await Workday.find({ _id: { $in: worksessions[i].workdays } });
				}
				res.status('200').send(worksessions);
			}
		})
	})

	.post( [
		body('startDate').isISO8601().custom((value) => moment(value) >= moment()).withMessage('Please enter a valid date'),
		body('endDate').isISO8601().custom((value, { req }) => value >= req.body.startDate).withMessage('Your enddate needs to be valid and after your startdate!'),
		body('studentNumber').trim().not().isEmpty().withMessage('studentnumber is required'),
		body('lab').trim().not().isEmpty().withMessage('Please select a lab!'),
		body('workdays').not().isEmpty().withMessage('A workperiod needs to have workdays')
	], async (req, res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}
		let worksession = new Worksession();
		worksession.startDate = req.body.startDate;
		worksession.endDate = req.body.endDate;
		worksession.studentNumber = req.body.studentNumber;
		worksession.lab = req.body.lab;
		// worksession.workdays = req.body.workdays;

		let workdays = req.body.workdays;
		if(workdays.length > 0) {
			if(workdays[0].constructor === String){
				worksession.workdays = await Workday.find({ _id: { $in: workdays } });
			} else {
				worksession.workdays = await Workday.insertMany(req.body.workdays);
			}
		}
		worksession.save();
		res.status('201').send(worksession);
	})

worksessionRouter.use('/:worksession_Id', (req,res, next) => {
	Worksession.findById(req.params.worksession_Id, (err, worksession) => {
		if(err) res.status('500').send(err);
		else {
			req.worksession = worksession;
			next();
		}
	})
})

worksessionRouter.route('/:worksession_Id')
	.get((req, res) => {
		res.status('200').send(req.worksession);
	})
	.put([
		body('startDate').isISO8601().custom((value) => moment(value) >= moment().add(-1, 'years')).withMessage('Please enter a valid date'),
		body('endDate').isISO8601().custom((value, { req }) => value >= req.body.startDate).withMessage('Your enddate needs to be valid and after your startdate!'),
		body('studentNumber').trim().not().isEmpty().withMessage('studentnumber is required'),
		body('lab').trim().not().isEmpty().withMessage('Please select a lab!'),
		body('workdays').not().isEmpty().withMessage('A workperiod needs to have workdays')
	],async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}
		req.worksession.startDate = req.body.startDate;
		req.worksession.endDate = req.body.endDate;
		req.worksession.studentNumber = req.body.studentNumber;
		req.worksession.lab = req.body.lab;
		// req.worksession.workdays = req.body.workdays;

		let workdays = req.body.workdays;
		if(workdays.length > 0) {
			if(workdays[0].constructor === String) {
				req.worksession.workdays = await Workday.find( { _id: { $in: workdays } } );
			} else {
				req.worksession.workdays = await Workday.insertMany(req.body.workdays);
			}
		}
		req.worksession.save();
		res.json(req.worksession);
	})
	.delete((req, res) => {
		req.worksession.remove(err => {
			if(err) res.status('500').send(err)
			else {
				res.status('204').send('removed')
			}
		})
	})

module.exports = worksessionRouter;
