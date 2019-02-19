const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Course', new Schema({
	name: { type: String },
	semester: { type: Number },
	courseCode: {type: String }
}));
