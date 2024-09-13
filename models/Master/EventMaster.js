const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EventMasterSchema = new mongoose.Schema(
    {
        // participantCategoryId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "ParticipantCategoryMaster",
        //     required: true,
        // },
        name: {
            type: String,
            
        },
        logo: String,
        contactNo: {
            type: String,
            
        },
        email: {
            type: String,
            
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventMaster", EventMasterSchema);
