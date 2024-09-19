//category name
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AwardCategorySchema = new mongoose.Schema(
  {
    awardName: {
        type: String,
    },
    description: {
        type: String,
        
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AwardCategory", AwardCategorySchema);
