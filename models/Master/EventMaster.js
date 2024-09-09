const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const InvestorSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        logo: String,
        contactNo: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        startDate: Date,
        endDate: Date,
        timing: String,
        description: {
            type: String,
        },
        remarks: String,
        StateID: {
            type: Schema.Types.ObjectId,
            ref: "State",
            required: true,
        },
        CountryID: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            required: true,
        },
        City: {
            type: String,
        },
        address: {
            type: String,
        },
        pincode: {
            type: Number,
        },
        IsActive: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Investor", InvestorSchema);
