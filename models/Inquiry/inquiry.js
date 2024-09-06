const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const InquirySchema = new mongoose.Schema(
  {
    yourName: {
      type: String,
    },
    yourEmail: {
      type: String,
    },
    subject: {
      type: String,
    },
    yourMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InquirySchema", InquirySchema);
