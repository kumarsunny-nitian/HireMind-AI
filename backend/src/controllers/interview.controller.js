const Interview = require("../models/interview.model");
const Application = require("../models/application.model");

const {
  createNotification,
} = require("../services/notification.service");

const emailQueue = require("../queues/email.queue");

// Schedule Interview
exports.scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      scheduledAt,
      meetingLink,
    } = req.body;

    const application = await Application.findById(
      applicationId
    )
      .populate("candidate")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const interview = await Interview.create({
      candidate: application.candidate._id,
      recruiter: req.user.id,
      job: application.job._id,
      application: application._id,
      scheduledAt,
      meetingLink,
    });

    // Real-time notification
    await createNotification(
      application.candidate._id,
      "Interview Scheduled",
      `Interview scheduled for ${new Date(
        scheduledAt
      ).toLocaleString()}`
    );

    // Update application status
    application.status = "shortlisted";
    await application.save();

    // Add email to queue
    await emailQueue.add(
      "sendInterviewEmail",
      {
        to: application.candidate.email,

        subject: "Interview Scheduled",

        html: `
          <h2>Interview Invitation</h2>

          <p>Hello ${application.candidate.name},</p>

          <p>
            Congratulations! You have been shortlisted
            for the next round of the hiring process.
          </p>

          <p>
            <strong>Job Title:</strong>
            ${application.job.title}
          </p>

          <p>
            <strong>Interview Date & Time:</strong>
            ${new Date(
              scheduledAt
            ).toLocaleString()}
          </p>

          <p>
            <strong>Meeting Link:</strong>
            <a href="${meetingLink}">
              ${meetingLink}
            </a>
          </p>

          <p>
            Please join the meeting on time and keep
            your internet connection stable.
          </p>

          <p>
            Best Regards,<br/>
            HireMind AI Recruitment Team
          </p>
        `,
      }
    );

    res.status(201).json({
      success: true,
      message: "Interview scheduled",
      interview,
    });
  } catch (error) {
    console.error(
      "Schedule Interview Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Candidate: View My Interviews
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      candidate: req.user.id,
    })
      .populate("job")
      .sort({
        scheduledAt: 1,
      });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get My Interviews Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recruiter: View Scheduled Interviews
exports.getRecruiterInterviews = async (
  req,
  res
) => {
  try {
    const interviews = await Interview.find({
      recruiter: req.user.id,
    })
      .populate(
        "candidate",
        "name email"
      )
      .populate("job")
      .sort({
        scheduledAt: 1,
      });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get Recruiter Interviews Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};