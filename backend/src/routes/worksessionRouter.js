const express = require('express');
//const worksession = require('../models/worksession');

const worksessionRouter = express.Router();

worksessionRouter.route('/')
	.get((req, res) => {
	/*	worksession.find({}, (err, worksessions) => {
			res.json(worksessions);
		})*/
		res.send('hello world');
	})
	.post((req, res) => {
		let worksession = req.body;
		console.log(req.body);
		res.status('201').send(worksession);
	})
