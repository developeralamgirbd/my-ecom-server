const {Schema, model} = require('mongoose');

const shippingAddressSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name minimum length 3 character'],
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'city is required']
    },
    state: {
        type: String,
        required: [true, 'state is required']
    },
    country: {
        type: String,
        required: [true, 'country is required']
    },
    zipCode: {
        type: String,
        required: [true, 'zipCode is required']
    },
    mobile: {
        type: String,
        required: [true, 'mobile is required']
    },


}, {timestamps: true, versionKey: false});

const ShippingAddress = model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;