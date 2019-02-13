const express = require('express');
const Worksession = require('../models/worksessionModel');
const Workday = require('../models/workdayModel');

const worksessionRouter = express.Router();

worksessionRouter.route('/')
	.get((req, res) => {
		Worksession.find({}, (err, worksessions) => {
			if (err) {
				res.status('500').send(err);
			}
			else {
				res.status('200').send(worksessions);
			}
		})
	})

	.post(async (req, res) => {
		let worksession = new Worksession();
		worksession.startDate = req.body.startDate;
		worksession.endDate = req.body.endDate;
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
		console.log(req.body);
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
	.put(async (req, res) => {
		req.worksession.startDate = req.body.startDate;
		req.worksession.endDate = req.body.endDate;
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
