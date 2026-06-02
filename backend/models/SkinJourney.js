const mongoose = require('mongoose');

const skinEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  glowScore: { type: Number, min: 0, max: 100 },
  hydrationScore: { type: Number, min: 0, max: 100 },
  breakouts: { type: Number, min: 0, default: 0 },
  oiliness: { type: Number, min: 0, max: 10 },
  sensitivity: { type: Number, min: 0, max: 10 },
  notes: String,
  photo: String,
  routineFollowed: { type: Boolean, default: false },
  productsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  weatherCondition: String,
  sleepHours: Number,
  waterIntake: Number,
  stressLevel: { type: Number, min: 0, max: 10 }
});

const skinJourneySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  entries: [skinEntrySchema],
  currentGlowScore: { type: Number, default: 0 },
  bestGlowScore: { type: Number, default: 0 },
  totalScans: { type: Number, default: 0 },
  routineConsistency: { type: Number, default: 0 },
  aiInsights: [{
    insight: String,
    type: { type: String, enum: ['positive', 'warning', 'tip'] },
    generatedAt: Date
  }],
  goals: [{
    title: String,
    description: String,
    targetDate: Date,
    achieved: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('SkinJourney', skinJourneySchema);
