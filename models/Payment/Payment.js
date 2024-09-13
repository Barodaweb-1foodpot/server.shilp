const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    // participantCategoryId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "ParticipantCategoryMaster",
    //   required: true,
    // },
    // startupId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Startup",
    //   default: null,
    // },
    // investorId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Investor",
    //   default: null,
    // },
    // visitorId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Visitor",
    //   default: null,
    // },
  
    // amount: {
    //   type: Number,
    //   required: true,
    // },
    // currency: {
    //   type: String,
    // },
    paymentStatus: {
      type: String,
      required: true,
      default: "IN-PROGRESS",
    },
    // eventId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "EventMaster",
    //   required: true,
    // },  
    refundAmount: {
      type: Number,
      required: false,
    },
    refundStatus: {
      type: Boolean,
      required: false,
    },
    razorpay_orderId: String,
    razorpay_paymentId: String,
    razorpay_signature: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
