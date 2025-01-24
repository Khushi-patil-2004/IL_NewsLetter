const mongoose = require("mongoose");

const NewsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    guidelines: { type: String },
    prizes: { type: String },
    keyDates: { type: String },
    registrationLink: { type: String },
    contactInfo: { type: String },
    capacity: { type: Number },
    poster: { type: String },
    banner: { type: String },
    rsvps: [
      {
        studentName: { type: String },
        studentEmail: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", NewsletterSchema);
