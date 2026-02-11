const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationsController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.post('/', authMiddleware, notificationController.createNotification);
router.get('/:userId', authMiddleware, notificationController.getUserNotifications);
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
