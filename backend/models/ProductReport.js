const mongoose = require('mongoose');

const productReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  barcode: String,
  scanType: { type: String, enum: ['barcode', 'ocr', 'manual'], default: 'ocr' },
  ingredientsAnalyzed: [{
    name: String,
    riskLevel: { type: String, enum: ['safe', 'caution', 'avoid'] },
    concern: String,
    benefit: String
  }],
  overallRisk: { type: String, enum: ['safe', 'caution', 'avoid'] },
  riskScore: Number,
  allergyConflicts: [String],
  chemicalConflicts: [{
    ingredient1: String,
    ingredient2: String,
    conflictReason: String,
    severity: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  aiVerdict: String,
  aiSummary: String,
  recommendation: String,
  safeAlternatives: [String],
  userReaction: { type: String, enum: ['love', 'neutral', 'dislike', 'reaction'] },
  notes: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('ProductReport', productReportSchema);
