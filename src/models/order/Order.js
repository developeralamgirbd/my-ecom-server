const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderID: {
        type: String
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },
    status: {
        type: String,
        enum: ['onhold', 'processing', "pendingpayment", "failed", "completed", "cancelled", "refunded"],
        default: 'onhold'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    }
});

const Order = model('Order', orderSchema);

module.exports = Order;