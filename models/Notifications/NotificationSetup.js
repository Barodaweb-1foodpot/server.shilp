const mongoose = require("mongoose");

const NotificationSetup = mongoose.Schema(
  {
    // typeName:{
    //     type:String,
    //     required:true
    // },
    formName: {
      type: String,
      required: true,
    },
    emailSubject: {
      type: String,
      //required:true
    },
    MailerName: {
      type: String,
      required: true,
    },
    CCMail: {
      type: String,
    },
    EmailFrom: {
      type: String,
      required: true,
    },
    ToAllUser: {
      type: Boolean,
    },
    EmailPassword: {
      type: String,
      required: true,
    },
    OutgoingServer: {
      type: String,
    },
    OutgoingPort: {
      type: Number,
    },
    EmailSignature: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    EmailSent: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationSetup", NotificationSetup);
