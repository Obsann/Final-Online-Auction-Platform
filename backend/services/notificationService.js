const Notification = require('../models/notificationsModel');

// Send outbid notification — called by bidController when a bidder is outbid
async function sendOutbidNotification({ userId, itemId }) {
  try {
    await Notification.create({
      userId,
      type: 'bid_outbid',
      message: `You were outbid on item ${itemId}`,
    });
  } catch (err) {
    console.warn('[notify] Failed to send outbid notification:', err.message);
  }
}

async function createNotification({ userId, type, message }) {
  return await Notification.create({ userId, type, message });
}

async function getUserNotifications(userId) {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
}

async function markNotificationAsRead(id) {
  const notification = await Notification.findById(id);
  if (!notification) throw new Error('Notification not found');

  notification.read = true;
  await notification.save();
  return notification;
}

async function deleteNotification(id) {
  const notification = await Notification.findById(id);
  if (!notification) throw new Error('Notification not found');

  await Notification.deleteOne({ _id: id });
  return { message: 'Notification deleted' };
}

module.exports = {
  sendOutbidNotification,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
