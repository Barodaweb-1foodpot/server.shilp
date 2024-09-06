//email
// isactive
//subs date


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const NewsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsLetter", NewsLetterSchema);
