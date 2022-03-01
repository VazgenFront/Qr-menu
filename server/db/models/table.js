const mongoose = require('mongoose');

const connection = require('../dbConnection');
const { Schema } = mongoose;

const TableSchema = new Schema({
	accountId: { type: mongoose.Types.ObjectId, required: true },
	tableId: { type: mongoose.Types.ObjectId, required: true },
	seatCount: { type: Number, required: true },
	reserved: { type: Boolean, required: true, default: false },
	name: { type: String, required: true, default: () => { return `Table ${Date.now()}` } },
	reserveToken: { type: String },
	notes: { type: String, required: true },
	lastReserved: { type: Date, required: true, default: null },
}, { versionKey: false });

TableSchema.index({ accountId: 1, tableId: 1 }, { unique: true });

module.exports = connection.model('Table', TableSchema);