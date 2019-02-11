const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workdayModel = new Schema({
	day: {Type: Date},
	workhours: {Type: Number}
});

module.exports = mongoose.model('Workday', workdayModel);
