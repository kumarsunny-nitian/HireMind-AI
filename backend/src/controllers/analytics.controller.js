const Job = require("../models/job.model");
const Application = require("../models/application.model");
const Interview = require("../models/interview.model");
const redis = require("../config/redis");

exports.getDashboardSummary = async (req, res) => {
  try {
    const cacheKey = `summary_${req.user.id}`;

    // Check cache first
    const cachedSummary = await redis.get(cacheKey);

    if (cachedSummary) {
      return res.status(200).json(JSON.parse(cachedSummary));
    }

    const recruiterId = req.user.id;

    const jobs = await Job.find({
      recruiter: recruiterId,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    const interviews = await Interview.find({
      recruiter: recruiterId,
    });

    const shortlisted = applications.filter(
      (app) => app.status === "shortlisted"
    );

    const selected = applications.filter(
      (app) => app.status === "selected"
    );

    const response = {
      success: true,
      summary: {
        totalJobs: jobs.length,
        totalApplications: applications.length,
        totalInterviews: interviews.length,
        shortlisted: shortlisted.length,
        selected: selected.length,
      },
    };

    // Cache for 10 minutes
    await redis.set(
      cacheKey,
      JSON.stringify(response),
      "EX",
      600
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getApplicationsPerJob = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    });

    const result = [];

    for (const job of jobs) {
      const count = await Application.countDocuments({
        job: job._id,
      });

      result.push({
        jobTitle: job.title,
        applications: count,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHiringFunnel = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    const funnel = {
      applied: applications.length,

      reviewing: applications.filter(
        (app) => app.status === "reviewing"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,

      selected: applications.filter(
        (app) => app.status === "selected"
      ).length,

      rejected: applications.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    res.status(200).json({
      success: true,
      funnel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getApplicationTrends = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    });

    const jobIds = jobs.map((job) => job._id);

    const trends = await Application.aggregate([
      {
        $match: {
          job: {
            $in: jobIds,
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};