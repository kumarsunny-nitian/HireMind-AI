const Job = require("../models/job.model");
const redis = require("../config/redis");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      experience,
      skillsRequired,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      experience,
      skillsRequired,
      deadline,
      recruiter: req.user.id,
    });

    // Clear cache
    await redis.del("all_jobs");

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const cachedJobs = await redis.get("all_jobs");

    if (cachedJobs) {
      return res.status(200).json({
        success: true,
        count: JSON.parse(cachedJobs).length,
        jobs: JSON.parse(cachedJobs),
      });
    }

    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    })
      .populate("recruiter", "name email companyName")
      .sort({ createdAt: -1 });

    // Cache for 5 minutes
    await redis.set("all_jobs", JSON.stringify(jobs), "EX", 300);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email companyName",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Clear cache
    await redis.del("all_jobs");

    res.status(200).json({
      success: true,
      message: "Job updated",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Clear cache
    await redis.del("all_jobs");

    res.status(200).json({
      success: true,
      message: "Job deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
