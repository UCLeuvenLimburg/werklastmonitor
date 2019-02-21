const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
const server = require('../src/index');

const Workday = require('../src/models/workdayModel');

chai.use(chaiHttp);

describe('Workday tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});
	after((done) => {
		chai.request(server).delete('/workdays').send();
		done();
	});

	describe('/GET workday', () => {
		it('get with id gives the right object', (done) => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: 0
			});
			testWorkday.save();
			chai.request(server)
				.get('/workdays/' + testWorkday._id)
				.send()
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					expect(res).to.have.status(200);
					// expect(res.body.day).to.be.eql(testWorkday.day);
					expect(res.body.workhours).to.be.eql(testWorkday.workhours);

					done();
				})
		})
	})

	describe('/POST workday', () => {
		it('Post a valid workday', (done) => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: 0
			});

			chai.request(server)
				.post('/workdays')
				.send(testWorkday)
				.end((err, res) => {
					if (err) {
						console.error(err);
					}
					expect(res).to.have.status(201);
					expect(res.body).to.be.a('object');
					expect(res.body).to.have.property('day')
					expect(res.body.workhours).to.be.eql(testWorkday.workhours)

					done();
				});
		});
		it('Post throws exception because of day in the past', (done) => {
			let testWorkday = new Workday({
				day: '2019-02-13',
				workhours: 10
			});

			chai.request(server)
				.post('/workdays')
				.send(testWorkday)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(1);

					done();
				});
		});
		it('Post throws exception because of negative workhours', (done) => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: -1
			});

			chai.request(server)
				.post('/workdays')
				.send(testWorkday)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(1);

					done();
				});
		});
		it('Post throws exception because of more than 24 workhours', (done) => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: 25
			});

			chai.request(server)
				.post('/workdays')
				.send(testWorkday)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(1);

					done();
				});
		});
		it('Post throws multiple exceptions', (done) => {
			let testWorkday = new Workday({
				day: '2019-02-13',
				workhours: 25
			});

			chai.request(server)
				.post('/workdays')
				.send(testWorkday)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}
					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(2);

					done();
				});
		});
	});

	describe('/PUT workday', () => {
		it('updates successfully with valid params', async () => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: 0
			});
			await testWorkday.save();
			let updatedWorkday = new Workday({
				day: Date.now(),
				workhours: 10
			});

			let res = await chai.request(server)
				.put('/workdays/' + testWorkday._id)
				.send(updatedWorkday);

			expect(res).to.have.status(200);
			expect(res.body.workhours).to.be.eql(updatedWorkday.workhours);
			expect(res.body.workhours).to.be.not.eql(testWorkday.workhours);
		});
		it('Does not update with invalid params', async () => {
			let testWorkday = new Workday({
				day: Date.now(),
				workhours: 0
			});
			await testWorkday.save();
			let updatedWorkday = new Workday({
				day: '2019-02-13',
				workhours: 25
			});
			let res = await chai.request(server)
				.put('/workdays/' + testWorkday._id)
				.send(updatedWorkday);

			expect(res).to.have.status(422);
			expect(res.body.errors).lengthOf(2);
		});
	});

});
