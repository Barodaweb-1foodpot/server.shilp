const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const VisitorSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
            required: true,
        },
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: "TicketMaster",
            required: true,
        },
        name: {
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
        companyName: {
            type: String,
        },
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

module.exports = mongoose.model("Visitor", VisitorSchema);
