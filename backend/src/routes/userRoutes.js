const express = require('express');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const { body, validationResult } = require('express-validator/check');

const userRouter = express.Router();

userRouter.route('/')
	.get((req, res) => {
		User.find({}, (err, users) => {
			if(err) {
				res.status('500').send(err);
			}
			else {
				res.status('200').send(users);
			}
		})
	})

	.post( [
		body('_id').trim().not().isEmpty().withMessage('No valid studentnumber defined'),
		body('_id').matches('^(r|u)[0-9]+').withMessage('No valid regex'),
	], async (req,res) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}
		let user = new User();
		user._id = req.body._id;

		let courses = req.body.courses;
		if(courses.length > 0) {
			if(courses[0].constructor === String) {
				user.courses = await Course.find({ _id: { $in: courses }})
			} else {
				user.courses = await Course.insertMany(req.body.courses);
			}
		}
		user.save();
		res.status('201').send(user);
	})

userRouter.use('/:user_id', (req, res, next) => {
	User.findById(req.params.user_id, (err, user) => {
		if(err) {
			res.status('500').send(err);
		}
		else {
			req.user = user;
			next();
		}
	});
})

userRouter.route('/:user_id')
	.get((req, res) => {
		res.status('200').send(req.user);
	})
	.put([], async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status('422').json({ errors: errors.array() });
		}
		let courses = req.body.courses;
		if(courses.length > 0) {
			if(courses[0].constructor === String) {
				req.user.courses = await Course.find( { _id: { $in: courses} } );
			} else {
				req.user.courses = await Course.insertMany(req.body.courses);
			}
		}
		req.user.save();
		res.json(req.user);
	})
	.delete((req, res) => {
		req.user.remove(err => {
			if (err) res.status('500').send(err)
			else {
				res.status('204').send('removed');
			}
		});
	});

module.exports = userRouter;
