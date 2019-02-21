const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
const server = require('../src/index');
const moment = require('moment');

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
	after((done) => {
		Worksession.deleteMany({}, (err) => {
			if (err) {
				console.error(err);
			}
		})
		Workday.deleteMany({}, (err) => {
			if (err) {
				console.error(err);
			}
		})
		Lab.deleteMany({}, (err) => {
			if (err) {
				console.error(err);
			}
		})
		done();
	});

	describe('/GET worksession', () => {
		it('get with id gives the right object', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
				milestones: [{
					name: 'testmilestone',
					duration: 4,
					isDone: false
				}]
			});
			testLab.save();
			let testWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: '2020-02-15',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: ['5c669626f756114810e51c27']
			});
			testWorksession.save();

			setTimeout(() => {
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
			}, 500);
		});

	});

	describe('/POST worksession', () => {
		it('Post a valid worksession', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
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
				day: moment(),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: moment().add(2, 'days'),
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

					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(6);

					done();
				});
		});
		it('Post throws exception when the enddate is before the startdate', (done) => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
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
				day: moment().add(1, 'days'),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
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
				courseId: '5c66e78eccc05c1fecc95022',
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
				day: moment(),
				workhours: 10
			});
			tworkday.save();
			let testWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
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
					expect(res.body.errors).lengthOf(1);

					done();
				});
		});
	});

	describe('/PUT worksession', () => {
		it('Workdays do get updated when worksessionsdays change.', async () => {
			let testlab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			await testlab.save();
			let firstworkday = new Workday({
				day: moment().add(1, 'days'),
				workhours: 5
			});
			let secondworkday = new Workday({
				day: moment().add(2, 'days'),
				workhours: 2
			});
			let worksessiontest = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: moment().add(2, 'days'),
				studentNumber: 'r000',
				lab: testlab._id,
				workdays: [firstworkday, secondworkday]
			});
			await worksessiontest.save();
			firstworkday.day = moment().add(3, 'days');
			firstworkday.workhours = 3;
			secondworkday.day = moment().add(4, 'days');
			secondworkday.workhours = 4;
			let updateworksession = new Worksession({
				startDate: moment().add(3, 'days'),
				endDate: moment().add(4, 'days'),
				studentNumber: 'r000',
				lab: testlab._id,
				workdays: [firstworkday, secondworkday]
			});
			let res = await chai.request(server)
				.put('/worksessions/' + worksessiontest._id)
				.send(updateworksession);
			expect(res).to.have.status(200);
			expect(res.body.workdays[0].workhours).to.be.eql(firstworkday.workhours);
			expect(res.body.workdays[1].workhours).to.be.eql(secondworkday.workhours);
		});
		it('Workdays do get updated and there is added a new workday', async () => {
			let testlab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			await testlab.save();
			let firstworkday = new Workday({
				day: moment().add(1, 'days'),
				workhours: 5
			});
			let secondworkday = new Workday({
				day: moment().add(2, 'days'),
				workhours: 2
			});
			let worksessiontest = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: moment().add(2, 'days'),
				studentNumber: 'r000',
				lab: testlab._id,
				workdays: [firstworkday, secondworkday]
			});
			await worksessiontest.save();
			firstworkday.day = moment().add(3, 'days');
			firstworkday.workhours = 3;
			secondworkday.day = moment().add(4, 'days');
			secondworkday.workhours = 4;
			let thirdworkday = new Workday({
				day: moment().add(5, 'days'),
				workhours: 10
			});
			let updateworksession = new Worksession({
				startDate: moment().add(3, 'days'),
				endDate: moment().add(4, 'days'),
				studentNumber: 'r000',
				lab: testlab._id,
				workdays: [firstworkday, secondworkday, thirdworkday]
			});
			let res = await chai.request(server)
				.put('/worksessions/' + worksessiontest._id)
				.send(updateworksession);
			expect(res).to.have.status(200);
			expect(res.body.workdays[0].workhours).to.be.eql(firstworkday.workhours);
			expect(res.body.workdays[1].workhours).to.be.eql(secondworkday.workhours);
		});
		it('updates successfully with valid params', async () => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			await testLab.save();
			let tworkday = new Workday({
				day: moment().add(1, 'days'),
				workhours: 10
			});
			await tworkday.save();
			let testWorksession = new Worksession({
				startDate: '2019-12-05',
				endDate: '2020-02-15',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			});
			let updatedWorksession = new Worksession({
				startDate: '2019-12-05',
				endDate: '2020-02-15',
				studentNumber: 'r000',
				lab: testLab._id,
				workdays: [tworkday._id]
			})
			await testWorksession.save();

			let res = await chai.request(server)
				.put('/worksessions/' + testWorksession._id)
				.send(updatedWorksession);

			expect(res).to.have.status(200);
			expect(res.body.studentNumber).to.be.eql(updatedWorksession.studentNumber);
			expect(res.body.lab.toString()).to.be.eql(testWorksession.lab.toString());
		});
		it('does not update for invalid changes', async () => {
			let testLab = new Lab({
				name: 'testLab4d4d4',
				startDate: '2020-01-05',
				endDate: '2020-05-22',
				hourEstimate: 14,
				courseId: '5c66e78eccc05c1fecc95022',
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					}
				]
			});
			await testLab.save();
			let tworkday = new Workday({
				day: moment(),
				workhours: 10
			});
			await tworkday.save();
			let testWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: '2020-02-15',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			});
			let updatedWorksession = new Worksession({
				startDate: moment().add(1, 'days'),
				endDate: '2019-02-14',
				studentNumber: 'r0635688',
				lab: testLab._id,
				workdays: [tworkday._id]
			})
			await testWorksession.save();

			let res = await chai.request(server)
				.put('/worksessions/' + testWorksession._id)
				.send(updatedWorksession);

			expect(res).to.have.status(422);
			expect(res.body.errors).lengthOf(1);
		});
	});
});
