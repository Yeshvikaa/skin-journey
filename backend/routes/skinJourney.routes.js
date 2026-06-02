const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getJourney, addEntry, getInsights, getAnalytics } = require('../controllers/skinJourney.controller');

router.get('/', protect, getJourney);
router.post('/entry', protect, addEntry);
router.get('/insights', protect, getInsights);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
