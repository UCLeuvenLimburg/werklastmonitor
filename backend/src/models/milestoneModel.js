const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Milestone', new Schema({
	name: { type: String},
	duration: { type: Number },
	isDone: { type: Boolean }
}));
