const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AdminUsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    bannerImage:{
      type:String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUserMaster", AdminUsersSchema);
