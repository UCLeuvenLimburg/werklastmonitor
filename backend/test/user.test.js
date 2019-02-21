const mongoose = require('mongoose');
const secrets = require('../src/secrets');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
const server = require('../src/index');
const moment = require('moment');

const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');

chai.use(chaiHttp);

describe('User tests', () => {
	before((done) => {
		mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => {
			done();
		});
	});
	after((done) => {
		chai.request(server).delete('/users').send();
		done();
	});

	describe('/POST user', () => {
		it('Post a valid user', (done) => {
			let user = new User({
				_id: 'r000' + moment().format('YYYYMMDDx'),
				courses: [ '5c6c09267df9a63af0444dab', '5c6c09337df9a63af0444dac' ]
			});

			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}

					expect(res).to.have.status(201);
					expect(res.body).to.be.a('object');
					expect(res.body).to.have.property('_id');
					expect(res.body).to.have.property('courses');
					expect(res.body._id).to.be.eql(user._id);
					expect(res.body.courses).lengthOf(2);
				});

			done();
		});
		it('Post a valid teacher', (done) => {
			let user = new User({
				_id: 'u1235' + moment().format('YYYYMMDDx'),
				courses: [ '5c6c09267df9a63af0444dab', '5c6c09337df9a63af0444dac' ]
			});

			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}

					expect(res).to.have.status(201);
					expect(res.body).to.be.a('object');
					expect(res.body).to.have.property('_id');
					expect(res.body).to.have.property('courses');
					expect(res.body._id).to.be.eql(user._id);
					expect(res.body.courses).lengthOf(2);
				});

			done();
		});
		it('Post regex error username', () => {
			let user = new User({
				_id: '123u5446',
				courses: [ '5c6c09267df9a63af0444dab', '5c6c09337df9a63af0444dac' ]
			});

			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					if(err) {
						console.error(err);
					}

					expect(res).to.have.status(422);
					expect(res.body.errors).lengthOf(1);
				});
		});
	});
	describe('/GET user', () => {
		it('get with id gives the right object', (done) => {
			let user = new User({
				_id: 'u333' + moment().format('YYYYMMDDx'),
				courses: ['5c6bc68ccdd0aa2de0d50dd6']
			});
			user.save();

			setTimeout(() => {
				chai.request(server)
					.get('/users/' + user._id)
					.end((err, res) => {
						if(err) {
							console.error(err);
						}

						expect(res).to.have.status(200);
						expect(res.body._id).to.be.eql(user._id);
						expect(res.body.courses).lengthOf(1);

						done();
					});
			}, 500);
		});
	});
	describe('/PUT user', () => {
		it('User adds courses', async () => {
			let user = new User({
				_id: 'u555' + moment().format('YYYYMMDDx'),
				courses: ['5c6bc68ccdd0aa2de0d50dd6']
			});
			let update = new User({
				courses: ['5c6c09267df9a63af0444dab', '5c6c09337df9a63af0444dac']
			});
			await user.save();
			let res = await chai.request(server)
				.put('/users/' + user._id)
				.send(update);

			expect(res).to.have.status(200);
			expect(res.body.courses).lengthOf(2);
		});
	});
});
