const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const TicketMasterSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "EventMaster",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        contactNo: {
            type: String,
        },
        email: {
            type: String,
        },
        amount: Number,
        remarks: String,
        startDate: Date,
        endDate: Date,
        IsActive: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TicketMaster", TicketMasterSchema);
