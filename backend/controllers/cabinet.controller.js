const Cabinet = require('../models/Cabinet');

// GET /api/cabinet
exports.getCabinet = async (req, res) => {
  try {
    let cabinet = await Cabinet.findOne({ user: req.user._id });
    if (!cabinet) cabinet = await Cabinet.create({ user: req.user._id, items: [] });
    const now = new Date();
    const expiringSoon = cabinet.items.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) && !i.isFinished).length;
    cabinet.expiringSoon = expiringSoon;
    cabinet.totalProducts = cabinet.items.filter(i => !i.isFinished).length;
    await cabinet.save();
    res.json({ success: true, cabinet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cabinet/add
exports.addItem = async (req, res) => {
  try {
    const { productName, brand, category, purchaseDate, openedDate, expiryDate, expiryMonths, notes, riskLevel, ingredients, productImage } = req.body;
    if (!productName) return res.status(400).json({ success: false, message: 'Product name is required.' });

    let cabinet = await Cabinet.findOne({ user: req.user._id });
    if (!cabinet) cabinet = new Cabinet({ user: req.user._id, items: [] });

    let computedExpiry = expiryDate;
    if (!computedExpiry && openedDate && expiryMonths) {
      const opened = new Date(openedDate);
      opened.setMonth(opened.getMonth() + parseInt(expiryMonths));
      computedExpiry = opened;
    }

    cabinet.items.push({ productName, brand, category, purchaseDate, openedDate, expiryDate: computedExpiry, expiryMonths, notes, riskLevel, ingredients, productImage });
    await cabinet.save();
    res.json({ success: true, message: 'Product added to cabinet!', cabinet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/cabinet/item/:itemId
exports.updateItem = async (req, res) => {
  try {
    const cabinet = await Cabinet.findOne({ user: req.user._id });
    if (!cabinet) return res.status(404).json({ success: false, message: 'Cabinet not found.' });
    const item = cabinet.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    Object.assign(item, req.body);
    await cabinet.save();
    res.json({ success: true, message: 'Item updated.', cabinet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/cabinet/item/:itemId
exports.removeItem = async (req, res) => {
  try {
    const cabinet = await Cabinet.findOne({ user: req.user._id });
    if (!cabinet) return res.status(404).json({ success: false, message: 'Cabinet not found.' });
    cabinet.items = cabinet.items.filter(i => i._id.toString() !== req.params.itemId);
    await cabinet.save();
    res.json({ success: true, message: 'Item removed.', cabinet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
