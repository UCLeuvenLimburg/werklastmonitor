const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const milestoneModel = new Schema({
	name: { type: String},
	duration: { type: Number },
	isDone: { type: Boolean }
});

module.exports = mongoose.model('Milestone', milestoneModel);
