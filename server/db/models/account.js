const mongoose = require('mongoose');

const connection = require('../dbConnection');
const { Schema } = mongoose;

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
            name: { type: String, unique: true },
            img: { type: String },
        },
    ],
    defaultMenuType: { type: String, required: true, default: "other" },
    styleId: { type: Number },
}, {versionKey: false});

AccountSchema.index({ email: 1, username: 1 }, { unique: true });

module.exports = connection.model('Account', AccountSchema);