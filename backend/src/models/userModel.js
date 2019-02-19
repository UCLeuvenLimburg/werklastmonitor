const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	_id: { type: String },
	courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
}));
