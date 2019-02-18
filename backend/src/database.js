const secrets = require('./secrets');
const config = require('./config')

const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@${secrets.database.host}:${secrets.database.port}/${secrets.database.db}`, {
	useNewUrlParser: true,
	poolSize: config.database.poolSize
});

module.exports = db;
