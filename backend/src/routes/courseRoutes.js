const express = require('express');
const Course = require('../models/courseModel');

const courseRouter = express.Router();

courseRouter.route('/')
	.get((req, res) => {
		Course.find({}, (err, courses) => {
			if (err) {
				res.status('500').send(err);
			} else {
				res.status('200').send(courses);
			}
		})
	})

	.post((req, res) => {
		let course = new Course();
		course.name = req.body.name;
		course.fase = req.body.fase;
		course.courseCode = req.body.courseCode;
		course.save();
		res.status('201').send(course);
	})

courseRouter.use('/:course_Id', (req,res,next) => {
	Course.findById(req.params.course_Id, (err, course) => {
		if(err) {
			res.status('500').send(err);
		} else {
			req.course = course;
			next();
		}
	})
})

courseRouter.route('/:course_Id')
	.get((req, res) => {
		res.status('200').send(req.course);
	})
	.delete((req, res) => {
		req.course.remove(err => {
			if(err) {
				res.status('500').send(err);
			}
			else {
				res.status('204').send('removed');
			}
		})
	})

module.exports = courseRouter;
