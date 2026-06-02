const mongoose = require('mongoose');

const chemicalConflictSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ingredient1: { type: String, required: true },
  ingredient2: { type: String, required: true },
  product1Name: String,
  product2Name: String,
  conflictReason: String,
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  recommendation: String,
  waitTime: String,
  saferRoutine: String,
  aiExplanation: String
}, { timestamps: true });

module.exports = mongoose.model('ChemicalConflict', chemicalConflictSchema);
