const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['scan_result', 'expiry_warning', 'community_alert', 'skin_tip', 'streak', 'goal', 'refill_reminder', 'cycle_sync'], default: 'skin_tip' },
  isRead: { type: Boolean, default: false },
  actionUrl: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
