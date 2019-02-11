const secrets = require('./secrets');

const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@werklastmonitor-shard-00-00-krkbh.gcp.mongodb.net:27017,werklastmonitor-shard-00-01-krkbh.gcp.mongodb.net:27017,werklastmonitor-shard-00-02-krkbh.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Werklastmonitor-shard-0&authSource=admin&retryWrites=true`);

module.exports = db
