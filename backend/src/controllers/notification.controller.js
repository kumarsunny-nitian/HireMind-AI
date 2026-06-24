const Notification = require(
  "../models/notification.model"
);

exports.getMyNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};