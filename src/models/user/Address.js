const {Schema, model} = require('mongoose');

const addressSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'Name is required']
    },
    country: {
        type: String,
        required: [true, 'country is required']
    },
    zipCode: {
        type: String,
        required: [true, 'Zip is required']
    }

}, {timestamps: true, versionKey: false});

const Address = model('Address', addressSchema);

module.exports = Address;