const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const StartUpCompany = new mongoose.Schema(
  {
    CategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryMaster'
    },
    CompanyName: {
      type: String,
    },
    Logo: {
      type: String,
    },
    ContactNo : {
      type: String,
    },
    Email : {
      type: String,
    },
    Description : {
        type : String,
    },
    IsActive : {
        type : Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StartUpCompany", StartUpCompany);