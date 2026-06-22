const mongoose = require("mongoose");

const interviewSchema =
  new mongoose.Schema(
    {
      candidate: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      recruiter: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      job: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },

      application: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
      },

      scheduledAt: {
        type: Date,
        required: true,
      },

      meetingLink: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "scheduled",
          "completed",
          "cancelled",
        ],
        default: "scheduled",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);