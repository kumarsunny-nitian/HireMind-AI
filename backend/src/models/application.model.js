const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    aiAnalysis: {
      summary: String,
      strengths: [String],
      weaknesses: [String],
      recommendation: String,
      interviewQuestions: [String],
      aiScore: Number,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    jobMatchPercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "selected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
