const express = require('express');
const Workday = require('../models/workday');

const workdayRouter = express.Router();

workdayRouter.route('/')
	.get((req, res) => {
		Workday.find({}, (err, workdays) => {
			res.json(workdays);
		});
	})
	.post((req, res) => {
		let workday = new Workday();
		workday.day = req.body.day;
		workday.workhours = req.body.workhours;
		workday.save();
		res.json(workday);
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
	.put((req, res) => {
		req.workday.day = req.body.day;
		req.workday.workhours = req.body.workhours;
		req.workday.save();
		res.json(req.workday);
	})
	.delete((req, res) => {
		req.worksession.remove(err => {
			if(err) res.status('500').send(err)
			else {
				res.status('204').send('removed')
			}
		})
	})

module.exports = workdayRouter;
