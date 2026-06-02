const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAlerts, reportAlert, upvoteAlert } = require('../controllers/community.controller');

router.get('/alerts', protect, getAlerts);
router.post('/report', protect, reportAlert);
router.post('/upvote/:alertId', protect, upvoteAlert);

module.exports = router;
