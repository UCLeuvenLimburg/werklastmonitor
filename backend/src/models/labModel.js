const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const labSchema = new Schema({
	name: { type: String},
	startDate: { type: Date },
	endDate: { type: Date },
	hourEstimate: { type: Number },
	milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
});
module.exports = mongoose.model('Lab', labSchema);
