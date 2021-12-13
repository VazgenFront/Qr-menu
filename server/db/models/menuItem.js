const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const MenuItemSchema = new Schema({
    accountId: { type: Number, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    isMainDish: { type: Boolean },
}, {versionKey: false});

MenuItemSchema.plugin(autoIncrement.plugin, { model: 'MenuItem', startAt: 1 });

module.exports = connection.model('MenuItem', MenuItemSchema);