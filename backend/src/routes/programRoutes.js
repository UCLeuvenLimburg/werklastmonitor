const express = require('express');
const Program = require('../models/programModel');
const Course = require('../models/courseModel')
// const {check, validationResult} = require('express-validator/check');

let programRouter = express.Router();
/*
const getCourses = async(courses) => {
	if (courses.length > 0 && courses[0].constructor === String) {
		return await Course.find({ _id: { $in: courses } });
	}
}
*/
programRouter.route('/')
	.get((req, res) => {
		Program.find(async (err, programs) => {
			if(err) {
				res.status(500).send(err);
			} else {
				for (let i = 0; i < programs.length; ++i) {
					let coursesObject = await Course.find({ _id: { $in: programs[i].courses } });
					programs[i].courses = coursesObject;
					console.log(coursesObject);
				}

				res.json(programs);
			}
		});
	})
	.post(async (req, res) => {
		let program = new Program();
		program.name = req.body.name;
		program.courses = await Course.find({ _id: { $in: req.body.courses } });

		program.save();
		res.json(program);
	});

programRouter.use('/:programId', (req, res, next) => {
	Program.findById(req.params.programId, (err, program) => {
		if(err) {
			res.status(500).send(err);
		} else {
			req.program = program;
			next();
		}
	});
});

programRouter.route('/:programId')
	.get(async (req, res) => {
		req.program.courses = await Course.find({ _id: { $in: req.lab.courses } });
		res.json(req.program)
	})
	.delete((req, res) => {
		req.program.remove((err) => {
			if(err) {
				res.status(500).send(err);
			} else {
				res.status(204).send('removed');
			}
		});
	});

module.exports = programRouter;
