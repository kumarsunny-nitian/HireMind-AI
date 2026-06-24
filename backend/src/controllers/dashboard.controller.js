const Job = require("../models/job.model");
const Application = require("../models/application.model");

exports.getDashboardStats = async (req, res) => {
  try {
    let totalJobs = 0;
    let totalApplications = 0;
    let shortlisted = 0;
    let selected = 0;

    // Recruiter/Admin Dashboard
    if (
      req.user.role === "admin" ||
      req.user.role === "recruiter"
    ) {
      const jobs = await Job.find({
        recruiter: req.user._id,
      });

      const jobIds = jobs.map(
        (job) => job._id
      );

      totalJobs = jobs.length;

      totalApplications =
        await Application.countDocuments({
          job: {
            $in: jobIds,
          },
        });

      shortlisted =
        await Application.countDocuments({
          job: {
            $in: jobIds,
          },
          status: "shortlisted",
        });

      selected =
        await Application.countDocuments({
          job: {
            $in: jobIds,
          },
          status: "selected",
        });

      console.log(
        "RECRUITER TOTAL JOBS:",
        totalJobs
      );
      console.log(
        "RECRUITER APPLICATIONS:",
        totalApplications
      );
      console.log(
        "RECRUITER SHORTLISTED:",
        shortlisted
      );
      console.log(
        "RECRUITER SELECTED:",
        selected
      );
    }

    // Candidate Dashboard
    else {
      totalJobs =
        await Job.countDocuments();

      totalApplications =
        await Application.countDocuments({
          candidate: req.user._id,
        });

      shortlisted =
        await Application.countDocuments({
          candidate: req.user._id,
          status: "shortlisted",
        });

      selected =
        await Application.countDocuments({
          candidate: req.user._id,
          status: "selected",
        });

      console.log(
        "CANDIDATE TOTAL JOBS:",
        totalJobs
      );
      console.log(
        "CANDIDATE APPLICATIONS:",
        totalApplications
      );
      console.log(
        "CANDIDATE SHORTLISTED:",
        shortlisted
      );
      console.log(
        "CANDIDATE SELECTED:",
        selected
      );
    }

    res.status(200).json({
      success: true,
      totalJobs,
      totalApplications,
      shortlisted,
      selected,
    });
  } catch (error) {
    console.log(
      "DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};