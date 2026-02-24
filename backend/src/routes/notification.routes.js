const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const checkAuth = require("../middleware/auth.middleware");

router.get("/", checkAuth, notificationController.getNotifications);
router.put("/:id/read", checkAuth, notificationController.markAsRead);
router.delete("/:id", checkAuth, notificationController.deleteNotification);

module.exports = router;