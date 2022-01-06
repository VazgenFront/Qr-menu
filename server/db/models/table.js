const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const TableSchema = new Schema({
	accountId: { type: Number, required: true },
	tableId: { type: Number, required: true },
	seatCount: { type: Number, required: true },
	reserved: { type: Boolean, required: true },
	reserveToken: { type: String },
	notes: { type: String, required: true },
}, { versionKey: false });

TableSchema.index({ accountId: 1, tableId: 1 }, { unique: true });

TableSchema.plugin(autoIncrement.plugin, { model: 'Table', startAt: 1 });

module.exports = connection.model('Table', TableSchema);