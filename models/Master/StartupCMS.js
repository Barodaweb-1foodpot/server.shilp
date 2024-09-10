const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const StartupSchema = new mongoose.Schema(
    {
        startupId: {
            type: Schema.Types.ObjectId,
            ref: "Startup",
            required: true,
        },
        content: String,
        contentFor: String,
        IsActive: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Startup", StartupSchema);
