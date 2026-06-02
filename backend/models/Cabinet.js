const mongoose = require('mongoose');

const cabinetItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productImage: String,
  brand: String,
  category: String,
  purchaseDate: Date,
  openedDate: Date,
  expiryDate: Date,
  expiryMonths: Number,
  isFavorite: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  refillReminder: { type: Boolean, default: false },
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  riskLevel: { type: String, enum: ['safe', 'caution', 'avoid'] },
  ingredients: [String]
});

const cabinetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cabinetItemSchema],
  totalProducts: { type: Number, default: 0 },
  expiringSoon: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cabinet', cabinetSchema);
