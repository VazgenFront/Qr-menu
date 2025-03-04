const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const OrderSchema = new Schema({
	accountId: { type: mongoose.Types.ObjectId, required: true },
	tableId: { type: mongoose.Types.ObjectId, required: true },
	tempCart: [
		{
			_id: false,
			menuItemId: { type: Number, required: true },
			itemName: { type: String, required: true },
			img: { type: String, required: true },
			movements: [
				{
					_id: false,
					type: { type: String, required: true,
						enum: ['addToOrder', 'cancelOrder', 'reduceMenuItem', 'removeMenuItem', 'addToTempCart', 'removeFromTempCart']
					},
					count: { type: Number, required: true },
					date: { type: Number, required: true },
				}
			],
			itemCount: { type: Number, required: true },
			itemPrice: { type: Number, required: true },
			itemTotalPrice: { type: Number, required: true },
			currency: { type: String, required: true },
		}
	],
	cart: [
		{
			menuItemId: { type: Number, required: true },
			itemName: { type: String, required: true },
			img: { type: String, required: true },
			itemCount: { type: Number, required: true },
			itemPrice: { type: Number, required: true },
			itemTotalPrice: { type: Number, required: true },
			currency: { type: String, required: true },
			date: { type: Number, required: true },
		}
	],
	reserveToken: { type: String, required: true, unique: true },
	isPaid: { type: Boolean, required: true, default: false },
	totalPrice: { type: Number, default: 0 },
	totalItems: { type: Number, default: 0 },
	tempTotalPrice: { type: Number, default: 0 },
	tempTotalItems: { type: Number, default: 0 },
	notes: { type: String, required: true },
	dateCreated: { type: Date, required: true },
}, { versionKey: false });

OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', startAt: 1 });

module.exports = connection.model('Order', OrderSchema);