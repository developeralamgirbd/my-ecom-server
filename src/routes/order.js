const express = require('express');
const router = express.Router();

// Order route
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");
const {createBraintreeToken, checkout} = require("../controllers/orderController");

// Order route
router.get('/braintree-token', AuthVerifyMiddleware, createBraintreeToken)
router.post('/checkout', AuthVerifyMiddleware, checkout)

module.exports = router;