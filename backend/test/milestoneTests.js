const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;

const Milestone = require('../src/models/milestoneModel');

describe('Milestone tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@werklastmonitor-shard-00-00-krkbh.gcp.mongodb.net:27017,werklastmonitor-shard-00-01-krkbh.gcp.mongodb.net:27017,werklastmonitor-shard-00-02-krkbh.gcp.mongodb.net:27017/${secrets.database.db}?ssl=true&replicaSet=Werklastmonitor-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			console.log('connected to database');
			done();
		});
	});

	describe('database tests', () => {
		it('saves a valid milestone', (done) => {
			let testMilestone = new Milestone({
				name: 'testMilestone',
				duration: 5,
				isDone: false
			});

			testMilestone.save();
			done();
		});

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
});
