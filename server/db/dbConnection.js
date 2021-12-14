const mongoose = require('mongoose');
const configs = require('../config/configs');

const dbConnection = mongoose.createConnection(configs.dbUri, configs.dbOptions);

module.exports = dbConnection;
