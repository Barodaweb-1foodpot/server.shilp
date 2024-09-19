const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AwardVotingSchema = new mongoose.Schema(
    {
        startupId: {
            type: Schema.Types.ObjectId,
            ref: "Startup",
        },
        // awardCategoryId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "AwardCategory",   
        // },
        email: "String",        
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("AwardVoting", AwardVotingSchema);