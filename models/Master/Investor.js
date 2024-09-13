const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const InvestorSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
            
        },
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: "TicketMaster",
            required: true,
        },
        name: {
            type: String,
            
        },
        contactNo: {
            type: String,
            
        },
        countryCode: {
            type: String,
        },
        email: {
            type: String,
            
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
            
        },
        CountryID: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            
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
            
        },
        IsPaid: {
            type: Boolean,
            default: false,
            
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Investor", InvestorSchema);
