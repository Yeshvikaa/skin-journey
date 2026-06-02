const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inci: String,
  riskLevel: { type: String, enum: ['safe', 'caution', 'avoid'], default: 'safe' },
  riskScore: { type: Number, min: 0, max: 10, default: 0 },
  category: String,
  description: String,
  concerns: [String],
  benefits: [String],
  suitableFor: [String],
  notSuitableFor: [String],
  conflictsWith: [String],
  isParaben: Boolean,
  isSulfate: Boolean,
  isFragrance: Boolean,
  isAlcohol: Boolean,
  isHormonalDisruptor: Boolean
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: { type: String, enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'mask', 'exfoliant', 'eye_cream', 'lip_care', 'body_care', 'hair_care', 'other'] },
  barcode: { type: String, index: true },
  image: String,
  description: String,
  ingredients: [ingredientSchema],
  ingredientsRaw: String,
  overallRisk: { type: String, enum: ['safe', 'caution', 'avoid'], default: 'safe' },
  riskScore: { type: Number, min: 0, max: 10, default: 0 },
  safeFor: [String],
  avoidFor: [String],
  keyBenefits: [String],
  keyConcerns: [String],
  alternativeSuggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  manufacturer: String,
  countryOfOrigin: String,
  batchInfo: String,
  expiryMonths: Number,
  crueltyFree: Boolean,
  vegan: Boolean,
  dermatologistTested: Boolean,
  scanCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
  isFlagged: { type: Boolean, default: false },
  aiAnalysis: {
    summary: String,
    recommendation: String,
    analyzedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
