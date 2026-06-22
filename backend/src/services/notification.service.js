const Notification =
  require("../models/notification.model");

const {
  getIO,
} = require("../config/socket");

const createNotification =
  async (
    userId,
    title,
    message
  ) => {
    const notification =
      await Notification.create({
        user: userId,
        title,
        message,
      });

    getIO()
      .to(userId.toString())
      .emit("notification", {
        title,
        message,
      });

    return notification;
  };

module.exports = {
  createNotification,
};