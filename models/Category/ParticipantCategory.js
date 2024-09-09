const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ParticipantCategoryMasterSchema = new mongoose.Schema(
  {
    categoryName: {
        type: String,
    },
    description: String,
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParticipantCategoryMaster", ParticipantCategoryMasterSchema);