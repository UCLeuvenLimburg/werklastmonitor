const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const labSchema = new Schema({
<<<<<<< HEAD
	name: { type: String},
	description: { type: String },
=======
	name: { type: String },
>>>>>>> 2597a270a2761f60702de6583f516f76305528d8
	startDate: { type: Date },
	endDate: { type: Date },
	hourEstimate: { type: Number },
	course: { type: Schema.Types.ObjectId, ref: 'Course' },
	milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
});
module.exports = mongoose.model('Lab', labSchema);
