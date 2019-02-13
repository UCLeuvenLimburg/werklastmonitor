const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Workday', new Schema({
	day: { type: Date },
	workhours: { type: Number }
}));
