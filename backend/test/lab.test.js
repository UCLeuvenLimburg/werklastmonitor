const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const server = require('../src/index');
let assert = require('assert');
let request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const Lab = require('../src/models/milestoneModel');

chai.use(chaiHttp);

describe('Lab tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});

	after((done) => {
		chai.request(server).delete('/labs').send();
		done();
	});

	describe('/POST labs', () => {
		it('should create a lab', (done) => {
			let lab = {
				name: 'testLab4d4d4',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					console.log(res.body);
					res.body.name.should.eql('testLab4d4d4');
					res.body.startDate.should.eql('2019-01-05T00:00:00.000Z');
					res.body.endDate.should.eql('2019-05-22T00:00:00.000Z');
					res.body.hourEstimate.should.eql(14);
					res.body.milestones[0].name.should.eql('testMilestone1');
					res.body.milestones[0].duration.should.eql(7);
					res.body.milestones[0].isDone.should.eql(false);
				});

			done();
		});

		it('should return 1 error message for a lab with an empty name', (done) => {
			let lab = {
				name: '',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});

		it('should return 1 error message for a lab with an empty startDate', (done) => {
			let lab = {
				name: 'ffff',
				startDate: '',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});
		/* End date cannot be tested yet */
		it('should return 1 error message for a lab with an empty endDate', (done) => {
			let lab = {
				name: 'fkfkfk',
				startDate: '2019-01-05',
				endDate: '',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});
		it('should return 1 error message for a lab with an courseId', (done) => {
			let lab = {
				name: 'fff',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});

		it('should return 1 error message for a lab with an empty milestone name', (done) => {
			let lab = {
				name: 'afzfez',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: '',
						duration: 7,
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});

		it('should return 1 error message for a lab with a string as duration for a milestone', (done) => {
			let lab = {
				name: 'afzfez',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'fff',
						duration: 'dzdz',
						isDone: false
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});

		it('should return 1 error message for a lab with a string as isDone for a milestone', (done) => {
			let lab = {
				name: 'afzfez',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'fff',
						duration: 7,
						isDone: 'flf'
					}
				]
			};

			chai.request(server)
				.post('/labs')
				.send(lab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(1);
				});

			done();
		});
	});

	describe('/PUT labs', () => {
		it('should update a lab', (done) => {
			let testLab = new Lab({
				name: 'afzfez',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'fff',
						duration: 7,
						isDone: 'flf'
					}
				]
			});

			testLab.save();

			let updatedLab = {
				name: 'updatedName',
				startDate: '2019-02-15',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'fff',
						duration: 7,
						isDone: true
					}
				]
			};

			chai.request(server)
				.put('/labs/' + testLab._id)
				.send(updatedLab)
				.end((err, res) => {
					res.body.name.should.eql('updatedName');
					res.body.startDate.should.eql('2019-02-15');
				});

			done();
		});

		it('should return 6 error message when updated lab has 6 invalid properties', (done) => {
			let testLab = new Lab({
				name: 'afzfez',
				startDate: '2019-01-05',
				endDate: '2019-05-22',
				hourEstimate: 14,
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'fff',
						duration: 7,
						isDone: 'flf'
					}
				]
			});

			testLab.save();

			let updatedLab = {
				name: '',
				startDate: '2019-02-15',
				endDate: '2019-05-22',
				hourEstimate: 'ff',
				course: '5c6bc68ccdd0aa2de0d50dd6',
				milestones: [
					{
						name: '',
						duration: -7,
						isDone: 'fa'
					},
					{
						name: 'fff',
						duration: 7,
						isDone: true
					}
				]
			};

			chai.request(server)
				.put('/labs/' + testLab._id)
				.send(updatedLab)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.have.property('errors');
					res.body.errors.length.should.be.eql(5);
				});

			done();
		});
	});
});

