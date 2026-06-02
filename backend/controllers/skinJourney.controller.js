const SkinJourney = require('../models/SkinJourney');
const { generateSkinInsights } = require('../services/gemini.service');

// GET /api/skin-journey
exports.getJourney = async (req, res) => {
  try {
    let journey = await SkinJourney.findOne({ user: req.user._id });
    if (!journey) journey = await SkinJourney.create({ user: req.user._id, entries: [] });
    res.json({ success: true, journey });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/skin-journey/entry
exports.addEntry = async (req, res) => {
  try {
    const { glowScore, hydrationScore, breakouts, oiliness, sensitivity, notes, routineFollowed, weatherCondition, sleepHours, waterIntake, stressLevel } = req.body;
    let journey = await SkinJourney.findOne({ user: req.user._id });
    if (!journey) journey = new SkinJourney({ user: req.user._id, entries: [] });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingIdx = journey.entries.findIndex(e => new Date(e.date).toDateString() === today.toDateString());
    const entry = { date: today, glowScore, hydrationScore, breakouts, oiliness, sensitivity, notes, routineFollowed, weatherCondition, sleepHours, waterIntake, stressLevel };

    if (existingIdx >= 0) journey.entries[existingIdx] = entry;
    else journey.entries.push(entry);

    // Update current glow score
    journey.currentGlowScore = glowScore;
    if (glowScore > journey.bestGlowScore) journey.bestGlowScore = glowScore;

    await journey.save();
    res.json({ success: true, message: 'Skin entry saved!', journey });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/skin-journey/insights
exports.getInsights = async (req, res) => {
  try {
    const journey = await SkinJourney.findOne({ user: req.user._id });
    if (!journey) return res.json({ success: true, insights: [] });
    const aiData = await generateSkinInsights(journey, req.user);
    
    // Save insights
    if (aiData.insights) {
      journey.aiInsights = aiData.insights.map(i => ({ ...i, generatedAt: new Date() }));
      await journey.save();
    }

    res.json({ success: true, insights: aiData.insights, trend: aiData.overallTrend, topTip: aiData.topTip, glowForecast: aiData.glowForecast });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/skin-journey/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const journey = await SkinJourney.findOne({ user: req.user._id });
    if (!journey) return res.json({ success: true, analytics: {} });

    const last180 = journey.entries.filter(e => new Date(e.date) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    const avgGlow = last180.length ? Math.round(last180.reduce((a, b) => a + (b.glowScore || 0), 0) / last180.length) : 0;
    const avgHydration = last180.length ? Math.round(last180.reduce((a, b) => a + (b.hydrationScore || 0), 0) / last180.length) : 0;
    const totalBreakouts = last180.reduce((a, b) => a + (b.breakouts || 0), 0);
    const routineConsistency = last180.length ? Math.round((last180.filter(e => e.routineFollowed).length / last180.length) * 100) : 0;

    res.json({
      success: true,
      analytics: {
        totalEntries: journey.entries.length,
        avgGlowScore: avgGlow,
        avgHydrationScore: avgHydration,
        totalBreakouts,
        routineConsistency,
        bestGlowScore: journey.bestGlowScore,
        currentGlowScore: journey.currentGlowScore,
        last30Days: journey.entries.slice(-30).map(e => ({
          date: e.date, glowScore: e.glowScore, hydrationScore: e.hydrationScore, breakouts: e.breakouts
        })),
        last6Months: last180.map(e => ({
          date: e.date, glowScore: e.glowScore, hydrationScore: e.hydrationScore, breakouts: e.breakouts
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
