const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    ContentFor: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
      required: true,
    },
    ContentUpload: {
      type: String,
    },

    IsActive: {
      type: Boolean,
      // required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
