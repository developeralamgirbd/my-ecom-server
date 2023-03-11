const express = require('express');
const router = express.Router();

// Order route
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");
const {createBraintreeToken, checkout, getOrders} = require("../controllers/orderController");

// Order route
router.get('/braintree-token', AuthVerifyMiddleware, createBraintreeToken)
router.post('/checkout', AuthVerifyMiddleware, checkout)

// Customer Route
router.get('/orders', AuthVerifyMiddleware, getOrders)

module.exports = router;