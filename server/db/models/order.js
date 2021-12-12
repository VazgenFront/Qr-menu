const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const OrderSchema = new Schema({
	accountId: { type: Number, required: true },
	tableId: { type: Number, required: true },
	menuItemId: { type: Number, required: true },
	itemCount: { type: Number, required: true },
	notes: { type: String, required: true },
}, {versionKey: false});

OrderSchema.plugin(autoIncrement.plugin, { model: 'Order' });

module.exports = connection.model('Order', OrderSchema);