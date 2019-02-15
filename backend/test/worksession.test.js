const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
const server = require('../src/index');

const Worksession = require('../src/models/worksessionModel');
const Lab = require('../src/models/worksessionModel');
const Workday = require('../src/models/workdayModel')

chai.use(chaiHttp);

describe('Worksession tests',() => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});

	describe('/GET worksession', () => {
		it('get with id gives the right object', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5555',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			testLab.save();
			let testWorksession = new Worksession({
				startDate: Date.now(),
				endDate: '2020-02-15',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: []
			});
			testWorksession.save();

			chai.request(server)
				.get('/worksessions/' + testWorksession._id)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}

					expect(res).to.have.status(200);
					expect(res.body.studentNumber.toString()).to.be.eql(testWorksession.studentNumber.toString());
					expect(res.body.lab.toString()).to.be.eql(testWorksession.lab.toString());

					done();
				});
		});

	});

	describe('/POST worksession', () => {
		it('Post a valid worksession', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5555',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			testLab.save();
			let tworkday = new Workday({
				day: Date.now(),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: Date.now(),
				endDate: '2020-02-15',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			});

			chai.request(server)
				.post('/worksessions')
				.send(testWorksession)
				.end((err, res) => {
					if (err) {
						console.error(err);
					}
					expect(res).to.have.status(201);
					expect(res.body).to.be.a('object');
					expect(res.body).to.have.property('startDate');
					expect(res.body).to.have.property('endDate');
					expect(res.body.studentNumber).to.be.eql(testWorksession.studentNumber);
					expect(res.body.lab.toString()).to.be.eql(testWorksession.lab.toString());

					done();
				});
		});
		it('Post throws exceptions when no body in req', (done) => {
			let testWorksession = new Worksession({

			});

			chai.request(server)
				.post('/worksessions')
				.send(testWorksession)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					console.log(res);
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(7);

					done();
				});
		});
		it('Post throws exception when the enddate is before the startdate', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5555',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			testLab.save();
			let tworkday = new Workday({
				day: Date.now(),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: Date.now(),
				endDate: '2019-02-14',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			});

			chai.request(server)
				.post('/worksessions')
				.send(testWorksession)
				.end((err, res) => {
					if(err) {
						console.error(err.errors);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(1);

					done();
				})
		})
		it('Post throws exceptions for dates in the past', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5555',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			testLab.save();
			let tworkday = new Workday({
				day: Date.now(),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: '2019-02-13',
				endDate: '2019-02-14',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			});

			chai.request(server)
				.post('/worksessions')
				.send(testWorksession)
				.end((err, res) => {
					if (err) {
						console.error(err);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(2);

					done();
				});
		});
	});
});
