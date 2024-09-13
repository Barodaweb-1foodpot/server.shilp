const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ContactSchema = new mongoose.Schema(
  {
    contactPersonName: {
      type: String,
    },
    subject: {
      type: String,
    },
    email: {
      type: String,
    },
    IsActive: {
      type: Boolean,
    },
    number:{
      type:Number
    },
    message:{
      type:String
    }
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactSchema", ContactSchema);
