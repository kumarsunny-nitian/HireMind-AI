const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/auth.middleware"
);

const upload = require(
  "../middleware/upload.middleware"
);

const {
  uploadResume,
  
} = require(
  "../controllers/resume.controller"
);

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;