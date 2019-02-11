const mongoose = require('mongoose');

const Schema = mongoose.Schema;
<<<<<<< HEAD
const labModel = new Schema({
	name: { type: String },
=======

module.exports = mongoose.model('Lab', new Schema({
	name: { type: String},
>>>>>>> 5c87538dd676c307d16b596fc2aa1daeab6612f1
	startDate: { type: Date },
	endDate: { type: Date },
	hourEstimate: { type: Number },
	milestones: [{ type: Schema.Types.ObjectId }]
}));
