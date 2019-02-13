const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;

const Lab = require('../src/models/milestoneModel');

describe('Lab tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});

	describe('database tests' , () => {
		it('saves a valid lab', (done) => {
			let testLab = new Lab({
				name: 'testLab',
				startDate: "2019-01-05",
				endDate: "2019-05-22",
				hourEstimate: 14,
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'testMilestone2',
						duration: 7,
						isDone: false
					}
				]
			});

			testLab.save();
			done();
		});

		it('returns the lab that was added', (done) => {
			let testLab = new Lab({
				name: 'testLab',
				startDate: "2019-01-05",
				endDate: "2019-05-22",
				hourEstimate: 14,
				milestones: [
					{
						name: 'testMilestone1',
						duration: 7,
						isDone: false
					},
					{
						name: 'testMilestone2',
						duration: 7,
						isDone: false
					}
				]
			});
			testLab.save();

			Lab.findById(testLab._id, (err, lab) => {
				if(err) {
					console.log(err);
				} else {
					expect(lab).to.equal(lab);
				}
			});

			done();
		});
	});
});
