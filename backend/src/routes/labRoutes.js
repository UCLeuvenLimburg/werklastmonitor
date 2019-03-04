const express = require('express');
const Lab = require('../models/labModel');
const Milestone = require('../models/milestoneModel');
const Course = require('../models/courseModel')
const { check, validationResult } = require('express-validator/check');

let labRouter = express.Router();

const getMilestones = async (milestones) => {
	if (milestones.length > 0 && milestones[0].constructor !== String) {
		let milestoneObjects = await Milestone.insertMany(milestones);
		milestones = [];
		for (let milestone of milestoneObjects) {
			milestones.push(milestone._id);
		}
	}
	return await Milestone.find({ _id: { $in: milestones } });
};

const getValidationChecks = () => {
	return [
		check('name').trim().not().isEmpty().withMessage('De naam van het lab mag niet leeg zijn.'),
		check('description').trim().not().isEmpty().withMessage('De beschrijving van het lab mag niet leeg zijn.'),
		check('startDate').isISO8601().withMessage('Gelieve een geldige startdatum te geven.'),
		check('endDate').custom((value, { req }) => value >= req.body.startDate).withMessage('Gelieve een geldige einddatum te geven, deze mag niet voor de startdatum zijn.'),
		check('hourEstimate').isFloat().withMessage('Gelieve een inschatting van de werkuren in te geven, dit moet een positief getal zijn.'),
		check('course').trim().not().isEmpty().withMessage('Gelieve een geldige vakcode in te geven, bijvoorbeeld: B-UCLL-MBI04A.'),
		check('milestones.*.name').trim().not().isEmpty().withMessage('De naam van de milestone mag niet leeg zijn.'),
		check('milestones.*.duration').isFloat({ min: 0 }).withMessage('Gelieve een inschatting van de werkuren in te geven voor deze milestone.')
	];
};

labRouter.route('/')
	.get((req, res) => {
		Lab.find(async (err, labs) => {
			if (err) {
				res.status(500).send(err);
			} else {
				for (let i = 0; i < labs.length; ++i) {
					labs[i].milestones = await Milestone.find({ _id: { $in: labs[i].milestones } });
					labs[i].course = await Course.findOne({ _id: labs[i].course });
				}

				res.json(labs);
			}
		});
	})
	.post(getValidationChecks(), async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let lab = new Lab();
		lab.name = req.body.name;
		lab.description = req.body.description;
		lab.startDate = req.body.startDate;
		lab.endDate = req.body.endDate;
		lab.hourEstimate = req.body.hourEstimate;
		if (req.body.course.match(/^[0-9a-f]{24}$/g)) {
			lab.course = await Course.findOne({ _id: req.body.course });
		} else {
			lab.course = await Course.findOne({ courseCode: req.body.course });
		}
		lab.milestones = await getMilestones(req.body.milestones);

		if (!lab.course) {
			res.status(422).json({
				errors: [{
					msg: 'Gelieve een geldige vakcode in te geven, bijvoorbeeld: B-UCLL-MBI04A.',
					param: 'courseId'
				}]
			});
		} else {
			lab.save();
		}

		res.json(lab);
	})
	.delete((req, res) => {
		Lab.deleteMany((err) => {
			if (err) {
				res.status('500').send(err);
			} else {
				res.status('204').send(err);
			}
		});
	});

labRouter.use('/:labId', (req, res, next) => {
	Lab.findById(req.params.labId, (err, lab) => {
		if (err) {
			res.status(500).send(err);
		} else {
			req.lab = lab;
			next();
		}
	});
});

labRouter.route('/:labId')
	.get(async (req, res) => {
		req.lab.milestones = await Milestone.find({ _id: { $in: req.lab.milestones } });
		req.lab.course = await Course.findOne({ _id: req.lab.course });
		res.json(req.lab);
	})
	.put(getValidationChecks(), async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		req.lab.name = req.body.name;
		req.lab.description = req.body.description;
		req.lab.startDate = req.body.startDate;
		req.lab.endDate = req.body.endDate;
		req.lab.hourEstimate = req.body.hourEstimate;
		if (req.body.course.match(/^[0-9a-f]{24}$/g)) {
			req.lab.course = req.body.course;
		} else {
			req.lab.course = (await Course.findOne({ courseCode: req.body.course }))._id;
		}
		req.lab.milestones = await getMilestones(req.body.milestones);

		await req.lab.save();
		req.lab.course = await Course.findOne({ _id: req.lab.course });
		res.json(req.lab);
	})
	.delete((req, res) => {
		req.lab.remove((err) => {
			if(err) {
				res.status(500).send(err);
			} else {
				res.status(204).send('removed');
			}
		});
	});

module.exports = labRouter;
