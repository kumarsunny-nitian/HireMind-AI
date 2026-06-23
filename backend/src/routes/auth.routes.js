const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");

const protect = require(
  "../middleware/auth.middleware"
);

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Profile
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;