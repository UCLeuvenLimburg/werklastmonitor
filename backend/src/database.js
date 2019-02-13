const secrets = require('./secrets');

const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@193.191.177.167:27017/${secrets.database.db}`, { useNewUrlParser: true });

module.exports = db;
