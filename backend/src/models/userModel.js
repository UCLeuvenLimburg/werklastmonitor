const config = require('../config');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
	_id: { type: String },
	courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
	milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
});

UserSchema.methods.generateJWT = function () {
	return jwt.sign({
		_id: this._id
	}, config.secret, {
		expiresIn: '1h'
	});
};

UserSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		token: this.generateJWT()
	};
};

module.exports = mongoose.model('User', UserSchema);
