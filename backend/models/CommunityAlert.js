const mongoose = require('mongoose');

const communityAlertSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alertType: { type: String, enum: ['fake_product', 'unsafe_batch', 'counterfeit', 'expired', 'mislabeled', 'adverse_reaction'], required: true },
  productName: String,
  brand: String,
  barcode: String,
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  location: {
    city: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [String],
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'resolved', 'investigating'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('CommunityAlert', communityAlertSchema);
