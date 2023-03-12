const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderID: {
        type: Date,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },
    status: {
        type: String,
        enum: ['onhold', 'processing', "pendingpayment", "failed", "delivered", "cancelled", "refunded"],
        default: 'onhold'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    }
}, {versionKey: false, timestamps: true});

const Order = model('Order', orderSchema);

module.exports = Order;