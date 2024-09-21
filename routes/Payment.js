const express = require("express");

const catchAsync = require("../utils/catchAsync");
const { checkout, paymentVerification, sendEmailOnRegistration } = require("../controllers/Payment/Payment");

const router = express.Router();

// reazorpapy
router.post("/auth/payment/checkout", catchAsync(checkout));

router.post("/auth/payment/paymentVerification/:customActiveTab/:amount", catchAsync(paymentVerification));

router.post("/auth/email/sendInvoice", catchAsync(sendEmailOnRegistration));

module.exports = router;
