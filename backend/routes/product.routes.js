const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { q, category, risk } = req.query;
    const query = {};
    if (q) query.$or = [{ name: new RegExp(q, 'i') }, { brand: new RegExp(q, 'i') }];
    if (category) query.category = category;
    if (risk) query.overallRisk = risk;
    const products = await Product.find(query).limit(20);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/barcode/:barcode', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found in database.' });
    product.scanCount += 1;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
