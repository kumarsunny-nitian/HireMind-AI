const Notification =
 require(
  "../models/notification.model"
 );

exports.getMyNotifications =
 async (req, res) => {
  try {

   const notifications =
    await Notification.find({
      user: req.user.id
    })
    .sort({
      createdAt: -1
    });

   res.status(200).json({
     success: true,
     notifications
   });

  } catch (error) {

   res.status(500).json({
     success: false,
     message: error.message
   });

  }
 };