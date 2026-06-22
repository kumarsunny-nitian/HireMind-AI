const Application = require("../models/application.model");
const Job = require("../models/job.model");
const User = require("../models/user.model");

const {
  calculateATSScore,
} = require("../services/ats.service");

exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      candidate: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const candidate = await User.findById(
      req.user.id
    );

    const {
      score,
      matchedSkills,
    } = calculateATSScore(
      candidate.parsedSkills || [],
      job.skillsRequired || []
    );

    // Debug Logs
    console.log(
      "CANDIDATE SKILLS:",
      candidate.parsedSkills
    );
    console.log(
      "JOB SKILLS:",
      job.skillsRequired
    );
    console.log(
      "ATS SCORE:",
      score
    );
    console.log(
      "MATCHED SKILLS:",
      matchedSkills
    );

    const application =
      await Application.create({
        candidate: req.user.id,
        job: jobId,
        atsScore: score,
        matchedSkills,
      });

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        candidate: req.user.id,
      })
        .populate("job")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getJobApplicants = async (
  req,
  res
) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    console.log("USER:", req.user);
    console.log(
      "ROLE:",
      req.user.role
    );
    console.log(
      "JOB RECRUITER:",
      job.recruiter.toString()
    );
    console.log(
      "REQUEST USER:",
      req.user.id
    );

    if (
      job.recruiter.toString() !==
        req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const applications =
      await Application.find({
        job: jobId,
      })
        .populate(
          "candidate",
          "name email resume parsedSkills"
        )
        .sort({
          atsScore: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateApplicationStatus =
  async (req, res) => {
    try {
      const application =
        await Application.findById(
          req.params.applicationId
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      const allowedStatuses = [
        "pending",
        "reviewing",
        "shortlisted",
        "rejected",
        "selected",
      ];

      if (
        !allowedStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status",
        });
      }

      application.status =
        req.body.status;

      await application.save();

      res.status(200).json({
        success: true,
        message:
          "Status updated successfully",
        application,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.getRankedApplicants =
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          job: req.params.jobId,
        })
          .populate(
            "candidate",
            "name email parsedSkills"
          )
          .sort({
            atsScore: -1,
          });

      res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };