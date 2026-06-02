const mongoose = require('mongoose');

const cycleSyncSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  lastPeriodDate: { type: Date, required: true },
  cycleLength: { type: Number, default: 28 },
  currentDay: Number,
  currentPhase: { type: String, enum: ['menstrual', 'follicular', 'ovulation', 'luteal'] },
  skinPredictions: [{
    day: Number,
    phase: String,
    skinCondition: String,
    recommendation: String,
    productsToAvoid: [String],
    productsToUse: [String]
  }],
  aiInsights: String,
  nextPeriodDate: Date
}, { timestamps: true });

module.exports = mongoose.model('CycleSync', cycleSyncSchema);
