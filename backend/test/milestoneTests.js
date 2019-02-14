const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const server = require('../src/index');
let assert = require('assert');
let request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let Milestone = require('../src/models/milestoneModel');

chai.use(chaiHttp);

describe('Milestone tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});

	describe('/POST milestone', () => {
		it('should create a milestone', (done) => {
			let milestone = {
				name: 'testMilestonee',
				duration: 5,
				isDone: false
			};

			chai.request(server)
				.post('/milestones')
				.send(milestone)
				.end((err, res) => {
					res.body.name.should.eql('testMilestonee');
					res.body.duration.should.eql(5);
					res.body.isDone.should.eql(false);
				});

			done();
		});

		it('should return 1 error message for a milestone with an empty name', (done) => {
			let invalidMilestone = {
				name: '',
				duration: 5,
				isDone: false
			}

			chai.request(server)
			.post('/milestones')
			.send(invalidMilestone)
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.have.property('errors');
				res.body.errors.length.should.be.eql(1);
			});

			done();
		});

		it('should return 1 error message for a milestone with a negative duration', (done) => {
			let invalidMilestone = {
				name: 'fff',
				duration: -1,
				isDone: false
			}

			chai.request(server)
			.post('/milestones')
			.send(invalidMilestone)
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.have.property('errors');
				res.body.errors.length.should.be.eql(1);
			});

			done();
		});

		it('should return 1 error message for a milestone with an invalid boolean for isDone', (done) => {
			let invalidMilestone = {
				name: 'fff',
				duration: 5,
				isDone: "5"
			}

			chai.request(server)
			.post('/milestones')
			.send(invalidMilestone)
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.have.property('errors');
				res.body.errors.length.should.be.eql(1);
			});

			done();
		});
	});

	describe('/GET milestones', () => {
		it('should get a milestone', (done) => {
			request(server)
				.get('/milestones')
				.expect(200, done);
		});

		describe('/GET/:id milestones', () => {
			it('should return the requested milestone', (done) => {
				let testMilestone = new Milestone( {
					name: "testjsjsj",
					duration: 8,
					isDone: false
				});

				testMilestone.save((err, milestone) => {
					chai.request(server)
						.get('/milestones/' + milestone._id)
						.end((err, res) => {
							res.body.should.have.property('_id').eql(testMilestone._id);
						});
				});


				done();
			})
		});
	});
});
