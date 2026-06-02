const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chat, getHistory, buildRoutine, clearHistory } = require('../controllers/carebot.controller');

router.post('/chat', protect, chat);
router.get('/history', protect, getHistory);
router.post('/build-routine', protect, buildRoutine);
router.delete('/history', protect, clearHistory);

module.exports = router;
