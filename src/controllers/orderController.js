
// Product Orders controller
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});
const mongoose = require('mongoose');
const OrderModel = require('../models/order/Order');
const OrderItemModel = require('../models/order/OrderItem');
const ShippingAddressModel = require('../models/order/ShippingAddress');
const {orderCreateService, orderDetailsService, getOrderDetailsService} = require("../services/order/orderCreateService");
const {productValidityService} = require("../services/productService/productService");
const { error } = require("../utils/error");
const getByPropertyService = require("../services/common/getByPropertyService");
const ObjectId = mongoose.Types.ObjectId;

exports.createBraintreeToken = async (_req, res, next)=>{
    try {
        const clientToken =  await gateway.clientToken.generate();
        res.status(200).json(clientToken)

    }catch (e) {
        next(e)
    }
}

exports.checkout = async (req, res, next)=>{
    try {

        const {nonce, cart, shippingAddress} = req.body;
        const user = req?.auth;
        const products = await productValidityService(cart);
        console.log(shippingAddress)

       const result = await orderCreateService(nonce, products, gateway, user, shippingAddress);
        res.status(200).json(result)

    }catch (e) {
        next(e)
    }
}

// Customer Controller
exports.getOrders = async (req, res, next)=>{
    try {
        const userID = req.auth._id;
        const orders = await getByPropertyService({userID: ObjectId(userID)}, OrderModel);
        res.status(200).json({
            orders
        })

    }catch (e) {
     next(e)
    }
}

exports.getOrderDetails = async (req, res, next)=>{
    try {
        const userID = req.auth._id;
        const orderID = req.params.id;
        const orderDetails = await getOrderDetailsService(orderID);
        const orders = await getByPropertyService({_id: ObjectId(orderID)}, OrderModel);
        const shippingAddress = await getByPropertyService({orderID: ObjectId(orderID)}, ShippingAddressModel);
        res.status(200).json({
            orderDetails,
            orders,
            shippingAddress
        })

    }catch (e) {
        console.log(e)
        next(e)
    }
}