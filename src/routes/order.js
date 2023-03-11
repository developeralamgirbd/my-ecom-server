const express = require('express');
const router = express.Router();

// Order route
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");
const {createBraintreeToken, checkout, getOrders, getOrderDetails} = require("../controllers/orderController");

// Order route
router.get('/braintree-token', AuthVerifyMiddleware, createBraintreeToken)
router.post('/checkout', AuthVerifyMiddleware, checkout)

// Customer Route
router.get('/orders/:id', AuthVerifyMiddleware, getOrderDetails)
router.get('/orders', AuthVerifyMiddleware, getOrders)

module.exports = router;