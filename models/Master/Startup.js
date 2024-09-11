const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const StartupSchema = new mongoose.Schema(
    {
        participantCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ParticipantCategoryMaster",
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "CategoryMaster",
        },
        contactPersonName: {
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

        password: String,

        companyName: {
            type: String,
        },
        legalName:
        {
            type:String
        },
        founderName :{
            type:String
        },
        stageOfStartup :{
            type:String
        },
        yearFounded:{
            type:Date
        },
        teamSize :{
            type:String
        },

        logo: String,

        brochure: {
            type: String,
        },
        productImages : {
            type: String,
        },
        description: {
            type: String,
        },

        // aboutStartup: String,

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

module.exports = mongoose.model("Startup", StartupSchema);
