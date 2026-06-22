const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require("../controllers/job.controller");



// Get All Jobs (Public)
router.get("/", getAllJobs);
router.get(
  "/recruiter/my-jobs",
  protect,
  authorizeRoles("recruiter", "admin"),
  getRecruiterJobs
);
router.get("/:id", getJobById);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  deleteJob
);


// Create Job (Recruiter/Admin)
router.post(
  "/",
  protect,
  authorizeRoles("recruiter", "admin"),
  createJob
);

module.exports = router;