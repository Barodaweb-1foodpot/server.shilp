const express = require("express");

const catchAsync = require("../utils/catchAsync");
const { checkout, paymentVerification } = require("../controllers/Payment/Payment");

const router = express.Router();

// reazorpapy
router.post("/auth/payment/checkout", catchAsync(checkout));

router.post("/auth/payment/paymentVerification", catchAsync(paymentVerification));

module.exports = router;
