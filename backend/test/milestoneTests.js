/*const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
const server = require('../src/index');

const Milestone = require('../src/models/milestoneModel');

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

	describe('database tests', () => {
		it('returns the milestone that was added', (done) => {
			let testMilestone = new Milestone({
				name: 'testMilestone',
				duration: 5,
				isDone: false
			});
			testMilestone.save();

			Milestone.findById(testMilestone._id, (err, milestone) => {
				expect(milestone).to.equal(testMilestone);
			});

			done();
		});
	});

	describe('/GET milestones', () => {
		it('should return all milestones', (done) => {
			let testMilestone = new Milestone({
				name: 'testMilestone',
				duration: 5,
				isDone: false
			});
			testMilestone.save();

			chai.request(server)
				.get('/milestones')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
				});

			done();
		});
	});

	describe('/POST milestone', () => {
		it('should POST a milestone', (done) => {
			let milestone = {
				name: "testmilestone",
				duration: 5,
				isDone: false
			};

			chai.request(server)
				.post('/milestone')
				.send(milestone)
				.end((err, res) => {
					res.should.have(200);
					res.body.should.be.a('object');
					res.body.milestone.should.have.property('name');
					res.body.milestone.should.have.property('duration');
					res.body.milestone.should.have.property('isDone');

					expect(milestone).to.equal(res.body.milestone);

					done();
				});
		});
	});
});
*/
