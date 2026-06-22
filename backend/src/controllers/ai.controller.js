const Application = require("../models/application.model");

const User = require("../models/user.model");

const Job = require("../models/job.model");

const {
  analyzeResume,
} = require("../services/aiAnalysis.service");

// Generate AI Analysis
exports.analyzeCandidate = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // STEP 11: Return saved analysis if already exists
    if (application.aiAnalysis) {
      return res.status(200).json({
        success: true,
        cached: true,
        aiAnalysis: application.aiAnalysis,
      });
    }

    const candidate = await User.findById(
      application.candidate
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const job = await Job.findById(
      application.job
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const aiResult = await analyzeResume(
      candidate,
      job
    );

    application.aiAnalysis = aiResult;

    await application.save();

    return res.status(200).json({
      success: true,
      cached: false,
      aiAnalysis: application.aiAnalysis,
    });
  } catch (error) {
    console.error(
      "AI Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// STEP 12: Get Saved Analysis
exports.getAnalysis = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      aiAnalysis: application.aiAnalysis,
    });
  } catch (error) {
    console.error(
      "Get Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};