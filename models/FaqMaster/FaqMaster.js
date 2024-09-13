//category name
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const FaqMasterSchema = new mongoose.Schema(
  {
    que: {
        type: String,
    },
    ans: {
      type: String,
    },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FaqMaster", FaqMasterSchema);
