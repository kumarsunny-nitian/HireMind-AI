const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const authorizeRoles = require("../middleware/role.middleware");

const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRankedApplicants,
  getRecentApplications,
} = require("../controllers/application.controller");

router.post("/apply/:jobId", protect, authorizeRoles("candidate"), applyJob);

router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications,
);

router.get(
  "/rankings/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getRankedApplicants,
);


router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getJobApplicants,
);

router.put(
  "/status/:applicationId",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus,
);

router.get(
  "/recent",
  protect,
  authorizeRoles("admin", "recruiter"),
  getRecentApplications
);

module.exports = router;
