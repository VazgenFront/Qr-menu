const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const StyleSchema = new Schema({
    navbarBgColor: { type: String, required: true },
    navbarTitleColor: { type: String, required: true },
    logo: { type: String, required: true, unique: true },
    mostBookedBorder: { type: String, required: true },
    fontFamily: { type: String, required: true },
}, { versionKey: false });

StyleSchema.plugin(autoIncrement.plugin, { model: 'Style', startAt: 1 });

module.exports = connection.model('Style', StyleSchema);