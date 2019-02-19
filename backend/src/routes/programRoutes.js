const express = require('express');
const Program = require('../models/programModel');
const Course = require('../models/courseModel')
// const {check, validationResult} = require('express-validator/check');

let programRouter = express.Router();

const getCourses = async(courses) => {
	if (courses.length > 0 && courses[0].constructor !== String) {
		let courseObjects = await Course.insertMany(courses);
		courses = [];
		for (let course of courseObjects) {
			courses.push(course._id);
		}
	}
	return await Course.find({ _id: { $in: courses } });
}

programRouter.route('/')
	.get((req, res) => {
		Program.find((err, programs) => {
			if(err) {
				res.status(500).send(err);
			} else {
				res.json(programs);
			}
		});
	})
	.post(async (req, res) => {
		let program = new Program();
		program.name = req.body.name;
		program.courses = await getCourses(req.body);

		program.save();
		res.json(program);
	});

programRouter.use('/:programId', (req, res, next) => {
	Program.findById(req.params.programId, (err, lab) => {
		if(err) {
			res.status(500).send(err);
		} else {
			req.lab = lab;
			next();
		}
	});
});

programRouter.route('/:programId')
	.get(async (req, res) => {
		req.program.courses = await Course.find({ _id: { $in: req.lab.courses } });
		res.json(req.program)
	});
