const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Lab', new Schema({
	name: { type: String},
	startDate: { type: Date },
	endDate: { type: Date },
	hourEstimate: { type: Number },
	milestones: [{ type: Schema.Types.ObjectId }]
}));
