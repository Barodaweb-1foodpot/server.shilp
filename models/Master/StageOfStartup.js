//category name
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const StageOfStartupSchema = new mongoose.Schema(
  {
    StageOfStartup: {
        type: String,
    },
    Description: {
      type: String,
    },
    Remarks: {
        type: String,
        },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StageOfStartup", StageOfStartupSchema);
