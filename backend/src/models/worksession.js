const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const worksessionModel = new Schema({
	startDate: {Type: Date},
	endDate: {Type: Date},
	lab: {Type: Schema.Types.ObjectId, ref: 'Lab'},
	worksessions: [{ type: Schema.Types.ObjectId, ref: 'Workday' }]
});

module.exports = mongoose.model('Worksession', worksessionModel);
