const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CycleSync = require('../models/CycleSync');
const { getCycleSkinPredictions } = require('../services/gemini.service');

router.get('/', protect, async (req, res) => {
  try {
    const sync = await CycleSync.findOne({ user: req.user._id });
    if (!sync) return res.json({ success: true, sync: null });
    res.json({ success: true, sync });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/setup', protect, async (req, res) => {
  try {
    const { lastPeriodDate, cycleLength } = req.body;
    if (!lastPeriodDate) return res.status(400).json({ success: false, message: 'Last period date is required.' });
    const predictions = await getCycleSkinPredictions(lastPeriodDate, cycleLength || 28, req.user.skinType);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + (cycleLength || 28));
    const sync = await CycleSync.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, lastPeriodDate, cycleLength: cycleLength || 28, currentDay: predictions.currentDay, currentPhase: predictions.currentPhase, aiInsights: predictions.aiInsights, nextPeriodDate, skinPredictions: [predictions] },
      { upsert: true, new: true }
    );
    res.json({ success: true, sync, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/predictions', protect, async (req, res) => {
  try {
    const sync = await CycleSync.findOne({ user: req.user._id });
    if (!sync) return res.status(404).json({ success: false, message: 'Cycle sync not set up.' });
    const predictions = await getCycleSkinPredictions(sync.lastPeriodDate, sync.cycleLength, req.user.skinType);
    res.json({ success: true, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
