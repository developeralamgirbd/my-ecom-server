const {Schema, model} = require('mongoose');

const ObjectId = Schema.Types.ObjectId;

const orderItemSchema = new Schema({
    orderID: {
        type: ObjectId,
        ref: 'Order'
    },
    productID: {
        type: ObjectId,
        ref: 'Product'
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    }

}, {timestamps: true, versionKey: false});

const OrderItem = model('OrderItem', orderItemSchema);

module.exports = OrderItem;