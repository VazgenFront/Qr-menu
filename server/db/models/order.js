const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const OrderSchema = new Schema({
	accountId: { type: Number, required: true },
	tableId: { type: Number, required: true },
	cart: [
		{
			menuItemId: { type: Number, required: true },
			itemCount: { type: Number, required: true },
		}
	],
	reserveToken: { type: String, required: true, unique: true },
	isPaid: { type: Boolean, required: true, default: false },
	notes: { type: String, required: true },
}, {versionKey: false});

OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', startAt: 1 });

module.exports = connection.model('Order', OrderSchema);