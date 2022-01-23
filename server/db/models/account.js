const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = require('../dbConnection');
const { Schema } = mongoose;

autoIncrement.initialize(connection);

const AccountSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    img: { type: String, required: false },
    typeId: { type: String, required: false, index: true },
    subTypeId: { type: String, required: false },
    status: {
        type: String, required: false, index: true,  default: 'enabled', enum: ['enabled', 'disabled', 'deactivated', 'pending'],
    },
    menuTypes: [
        {
            _id: false,
            name: {type: String},
        },
    ],
    defaultMenuType: { type: String, required: true, default: "other" },
    styleId: { type: Number },
}, {versionKey: false});

AccountSchema.index({ email: 1, username: 1 }, { unique: true });

AccountSchema.plugin(autoIncrement.plugin, { model: 'Account', startAt: 1 });

module.exports = connection.model('Account', AccountSchema);