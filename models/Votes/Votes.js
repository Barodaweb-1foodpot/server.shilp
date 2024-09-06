const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const VotesSchema = new mongoose.Schema(
  {
    StartupID: {
      type: String,
    },
    VoterName: {
      type: String,
    },
    Voteremail: {
      type: String,
    },
    VotercontactNo : {
      type: String,
    },
    Remarks : {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VotesSchema", VotesSchema);