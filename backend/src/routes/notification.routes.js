const express = require("express");

const router = express.Router();

const protect =
 require(
  "../middleware/auth.middleware"
 );

const {
 getMyNotifications
} = require(
 "../controllers/notification.controller"
);

router.get(
 "/",
 protect,
 getMyNotifications
);

module.exports = router;