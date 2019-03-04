const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Worksession', new Schema({
	startDate: { type: Date },
	endDate: { type: Date },
	studentNumber: { type: String },
	lab: { type: Schema.Types.ObjectId, ref: 'Lab' },
	workdays: [{ type: Schema.Types.ObjectId, ref: 'Workday' }]
}));
