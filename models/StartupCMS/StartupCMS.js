const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ContentSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
    //   required: true,
    },
    
    Content: {
      type: String,
    },
    startupName:{
        type: Schema.Types.ObjectId,
        ref: "Startup",
        required: true,
    },

    IsActive: {
      type: Boolean,
      // required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StartUpCMS", ContentSchema);
