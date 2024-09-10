const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const StartupSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "CategoryMaster",
            required: true,
        },
        contactPersonName: {
            type: String,
            required: true,
        },
        contactNo: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: String,
        companyName: {
            type: String,
            required: true,
        },
        logo: String,
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
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        IsActive: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Startup", StartupSchema);
