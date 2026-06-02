const { analyzeIngredients, checkChemicalConflicts } = require('../services/gemini.service');
const ProductReport = require('../models/ProductReport');
const Cabinet = require('../models/Cabinet');
const Product = require('../models/Product');

// Parse ingredient list from raw text
const parseIngredients = (rawText) => {
  return rawText
    .split(/[,\n;]/)
    .map(i => i.trim())
    .filter(i => i.length > 2 && i.length < 100);
};

// POST /api/scan/analyze-ingredients
exports.analyzeIngredients = async (req, res) => {
  try {
    const { ingredientsRaw, productName, barcode, scanType } = req.body;
    if (!ingredientsRaw) return res.status(400).json({ success: false, message: 'Ingredients text is required.' });

    const ingredientsList = parseIngredients(ingredientsRaw);
    if (ingredientsList.length === 0) return res.status(400).json({ success: false, message: 'Could not parse ingredients.' });

    const analysis = await analyzeIngredients(ingredientsList, req.user);

    // Save report
    const report = await ProductReport.create({
      user: req.user._id,
      productName: productName || 'Unknown Product',
      barcode,
      scanType: scanType || 'ocr',
      ingredientsAnalyzed: analysis.ingredients?.map(i => ({
        name: i.name,
        riskLevel: i.riskLevel,
        concern: i.concern,
        benefit: i.benefit
      })),
      overallRisk: analysis.overallRisk,
      riskScore: analysis.riskScore,
      allergyConflicts: analysis.allergyConflicts,
      aiVerdict: analysis.aiVerdict,
      aiSummary: analysis.aiSummary,
      recommendation: analysis.recommendation,
      safeAlternatives: analysis.safeAlternatives
    });

    res.json({ success: true, report, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/scan/conflict-check
exports.checkConflicts = async (req, res) => {
  try {
    const { newProductIngredients, newProductName } = req.body;
    const cabinet = await Cabinet.findOne({ user: req.user._id });
    if (!cabinet || cabinet.items.length === 0) {
      return res.json({ success: true, conflicts: [], message: 'No products in cabinet to compare.' });
    }

    const allConflicts = [];
    for (const item of cabinet.items.slice(0, 5)) {
      if (item.ingredients?.length > 0) {
        const result = await checkChemicalConflicts(
          parseIngredients(newProductIngredients),
          item.ingredients,
          newProductName,
          item.productName
        );
        if (result.hasConflict) {
          allConflicts.push({ cabinetProduct: item.productName, ...result });
        }
      }
    }

    res.json({ success: true, conflicts: allConflicts, hasConflicts: allConflicts.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/scan/history
exports.getScanHistory = async (req, res) => {
  try {
    const reports = await ProductReport.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/scan/report/:id
exports.getReport = async (req, res) => {
  try {
    const report = await ProductReport.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
