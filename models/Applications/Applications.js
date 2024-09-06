const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    email: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    currentGrade: {
      type: String,
    },
    incomeCertificate: {
      type: String,
    },
    photo: {
      type: String,
    },
    studentAadharCard: {
      type: String,
    },
    parentAadharCard: {
      type: String,
    },
    panCard: {
      type: String,
    },
    ssc: {
      type: String,
    },
    schoolLeavingCertificate: {
      type: String,
    },
    itReturn: {
      type: String,
    },
    deathCertificate: {
      type: String,
    },
    recommendationLetter: {
      type: String,
    },
    IsApproved: {
      type: Boolean,
      default: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
