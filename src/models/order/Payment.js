const {Schema, model} = require('mongoose');

const paymentSchema = new Schema({
    orderID:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: String,
        required: [true, 'amount is required']
    },
    status: {
        type: String,
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required']
    },
    payment: {}
}, {timestamps: true, versionKey: false});

const Payment = model('Payment', paymentSchema);

module.exports = Payment;