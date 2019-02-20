const express = require('express');
const Program = require('../models/programModel');
const Course = require('../models/courseModel')
const {check, validationResult} = require('express-validator/check');

let programRouter = express.Router();
/*
const getCourses = async(courses) => {
	if (courses.length > 0 && courses[0].constructor === String) {
		return await Course.find({ _id: { $in: courses } });
	}
}
*/
const getValidationChecks = () => {
	return [
		check('name').trim().not().isEmpty().withMessage('Program name cannot be empty'),
		check('courses').not().isEmpty().withMessage('Program courses cannot be empty')
	];
};

programRouter.route('/')
	.get((req, res) => {
		Program.find(async (err, programs) => {
			if(err) {
				res.status(500).send(err);
			} else {
				for (let i = 0; i < programs.length; ++i) {
					let coursesObject = await Course.find({ _id: { $in: programs[i].courses } });
					programs[i].courses = coursesObject;
				}

				res.json(programs);
			}
		});
	})
	.post(getValidationChecks(), async (req, res) => {
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
	})
	.put(getValidationChecks(), async (req, res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		req.program.name = req.body.name;
		req.program.courses = await Course.find({ _id: { $in: req.body.courses } });

		await req.program.save();
		res.json(req.program);
	});

module.exports = programRouter;
