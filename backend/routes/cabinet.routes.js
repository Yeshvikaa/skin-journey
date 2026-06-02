const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCabinet, addItem, updateItem, removeItem } = require('../controllers/cabinet.controller');

router.get('/', protect, getCabinet);
router.post('/add', protect, addItem);
router.put('/item/:itemId', protect, updateItem);
router.delete('/item/:itemId', protect, removeItem);

module.exports = router;
