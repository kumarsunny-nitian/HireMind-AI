const express = require("express");

const router = express.Router();

const protect =
  require(
    "../middleware/auth.middleware"
  );

const authorizeRoles =
  require(
    "../middleware/role.middleware"
  );

const {
  scheduleInterview,
  getMyInterviews,
  getRecruiterInterviews,
} = require(
  "../controllers/interview.controller"
);

router.post(
  "/schedule",
  protect,
  authorizeRoles(
    "recruiter",
    "admin"
  ),
  scheduleInterview
);

router.get(
  "/candidate",
  protect,
  authorizeRoles("candidate"),
  getMyInterviews
);

router.get(
  "/recruiter",
  protect,
  authorizeRoles(
    "recruiter",
    "admin"
  ),
  getRecruiterInterviews
);

module.exports = router;