const Job = require("../models/job.model");
const Application = require("../models/application.model");

exports.getDashboardStats = async (
  req,
  res
) => {
  try {
    const totalJobs =
      await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const shortlisted =
      await Application.countDocuments({
        status: "shortlisted",
      });

    const selected =
      await Application.countDocuments({
        status: "selected",
      });

    res.status(200).json({
      success: true,
      totalJobs,
      totalApplications,
      shortlisted,
      selected,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};