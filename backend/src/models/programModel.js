const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Program', new Schema({
	name: { type: String },
	courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
}));
