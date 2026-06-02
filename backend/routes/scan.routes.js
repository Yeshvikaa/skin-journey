const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { analyzeIngredients, checkConflicts, getScanHistory, getReport } = require('../controllers/scan.controller');

router.post('/analyze-ingredients', protect, analyzeIngredients);
router.post('/conflict-check', protect, checkConflicts);
router.get('/history', protect, getScanHistory);
router.get('/report/:id', protect, getReport);

module.exports = router;
